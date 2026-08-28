"""
Populate the *_es (Spanish) name columns in the taxonomy tables,
using the Spanish taxonomy Excel file as the source.

Usage:
    python scripts/populate_name_es.py path/to/excel.xlsx

What it does:
1. Reads the Excel (all rows with data, from the first sheet).
2. Builds a nested tree (Phylum -> Class -> Order -> Family -> Genus -> Species)
   from the Spanish names, in the order they first appear in the file.
3. Fetches the same tree from Supabase (English names), ordered by id.
4. At every level, pairs DB and Excel children positionally, up to however
   many both sides have in common. Anything left over on the longer side
   (extra records in the DB not present in the Excel, or vice versa) is
   reported, not translated this round, and does NOT block the rest.
5. Prints a full report and asks for confirmation before writing anything
   to the database.
"""

import os
import sys
from collections import OrderedDict

import openpyxl

# Make sure the project root (the folder containing main.py and the "app"
# package) is on sys.path, regardless of where this script is run from.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import supabase


def read_excel_tree(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.worksheets[0]

    tree = OrderedDict()

    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or row[0] is None:
            continue

        _, filo, clase, orden, familia, genero, especie, _ = row

        phylum_node = tree.setdefault(filo, OrderedDict())
        class_node = phylum_node.setdefault(clase, OrderedDict())
        order_node = class_node.setdefault(orden, OrderedDict())
        family_node = order_node.setdefault(familia, OrderedDict())
        genus_node = family_node.setdefault(genero, [])

        if especie not in genus_node:
            genus_node.append(especie)

    return tree


def read_db_tree():
    phyla = supabase.table("phylum").select("id_phylum, name").order("id_phylum").execute().data
    classes = supabase.table("class").select("id_class, name, id_phylum").order("id_class").execute().data
    orders = supabase.table("orders").select("id_order, name, id_class").order("id_order").execute().data
    families = supabase.table("family").select("id_family, name, id_order").order("id_family").execute().data
    genera = supabase.table("genus").select("id_genus, name, id_family").order("id_genus").execute().data
    species = supabase.table("species").select("id_species, name, id_genus").order("id_species").execute().data

    classes_by_phylum = {}
    for c in classes:
        classes_by_phylum.setdefault(c["id_phylum"], []).append(c)

    orders_by_class = {}
    for o in orders:
        orders_by_class.setdefault(o["id_class"], []).append(o)

    families_by_order = {}
    for f in families:
        families_by_order.setdefault(f["id_order"], []).append(f)

    genera_by_family = {}
    for g in genera:
        genera_by_family.setdefault(g["id_family"], []).append(g)

    species_by_genus = {}
    for s in species:
        species_by_genus.setdefault(s["id_genus"], []).append(s)

    tree = OrderedDict()

    for p in phyla:
        class_node = OrderedDict()
        for c in classes_by_phylum.get(p["id_phylum"], []):
            order_node = OrderedDict()
            for o in orders_by_class.get(c["id_class"], []):
                family_node = OrderedDict()
                for f in families_by_order.get(o["id_order"], []):
                    genus_node = OrderedDict()
                    for g in genera_by_family.get(f["id_family"], []):
                        genus_node[(g["id_genus"], g["name"])] = [
                            (s["id_species"], s["name"])
                            for s in species_by_genus.get(g["id_genus"], [])
                        ]
                    family_node[(f["id_family"], f["name"])] = genus_node
                order_node[(o["id_order"], o["name"])] = family_node
            class_node[(c["id_class"], c["name"])] = order_node
        tree[(p["id_phylum"], p["name"])] = class_node

    return tree


def _readable_name(item):
    """Best-effort extraction of a human-readable name from a leftover item,
    whether it's a DB entry ((id, name), children), an Excel branch entry
    (name, children), a DB species tuple (id, name), or a plain Excel
    species name string."""

    if isinstance(item, tuple) and len(item) == 2:
        key, _value = item
        if isinstance(key, tuple):
            return key[1]        # DB branch: ((id, name), children)
        if isinstance(key, int):
            return item[1]       # DB species: (id, name)
        return key                # Excel branch: (name, children)

    return str(item)


def align(db_items, es_items, label):
    """Pairs db_items and es_items positionally, up to the shorter length.
    Returns (pairs, note) where note describes any leftover mismatch,
    or None if the counts matched exactly."""

    n = min(len(db_items), len(es_items))
    note = None

    if len(db_items) != len(es_items):
        if len(db_items) > n:
            extra_side, extra_items = "DB", db_items[n:]
        else:
            extra_side, extra_items = "Excel", es_items[n:]

        extra_names = [_readable_name(it) for it in extra_items]

        note = (f"{label}: DB has {len(db_items)}, Excel has {len(es_items)} "
                f"— extra on the {extra_side} side, left untranslated: {extra_names}")

    return list(zip(db_items[:n], es_items[:n])), note


def compare_and_collect(db_tree, es_tree):
    updates = {
        "phylum": {},
        "class": {},
        "orders": {},
        "family": {},
        "genus": {},
        "species": {},
    }
    report = []

    phylum_pairs, note = align(list(db_tree.items()), list(es_tree.items()), "Phylum level")
    if note:
        report.append(note)

    for db_phylum_item, es_phylum_item in phylum_pairs:
        (p_id, p_name), p_children_db = db_phylum_item
        es_p_name, es_p_children = es_phylum_item
        updates["phylum"][p_id] = es_p_name

        class_pairs, note = align(
            list(p_children_db.items()), list(es_p_children.items()),
            f"Class level under Phylum '{p_name}' (id={p_id})"
        )
        if note:
            report.append(note)

        for db_class_item, es_class_item in class_pairs:
            (c_id, c_name), c_children_db = db_class_item
            es_c_name, es_c_children = es_class_item
            updates["class"][c_id] = es_c_name

            order_pairs, note = align(
                list(c_children_db.items()), list(es_c_children.items()),
                f"Order level under Class '{c_name}' (id={c_id})"
            )
            if note:
                report.append(note)

            for db_order_item, es_order_item in order_pairs:
                (o_id, o_name), o_children_db = db_order_item
                es_o_name, es_o_children = es_order_item
                updates["orders"][o_id] = es_o_name

                family_pairs, note = align(
                    list(o_children_db.items()), list(es_o_children.items()),
                    f"Family level under Order '{o_name}' (id={o_id})"
                )
                if note:
                    report.append(note)

                for db_family_item, es_family_item in family_pairs:
                    (f_id, f_name), f_children_db = db_family_item
                    es_f_name, es_f_children = es_family_item
                    updates["family"][f_id] = es_f_name

                    genus_pairs, note = align(
                        list(f_children_db.items()), list(es_f_children.items()),
                        f"Genus level under Family '{f_name}' (id={f_id})"
                    )
                    if note:
                        report.append(note)

                    for db_genus_item, es_genus_item in genus_pairs:
                        (g_id, g_name), g_species_db = db_genus_item
                        es_g_name, es_species = es_genus_item
                        updates["genus"][g_id] = es_g_name

                        species_pairs, note = align(
                            g_species_db, es_species,
                            f"Species level under Genus '{g_name}' (id={g_id})"
                        )
                        if note:
                            report.append(note)

                        for db_species_item, es_species_name in species_pairs:
                            s_id, _s_name = db_species_item
                            updates["species"][s_id] = es_species_name

    return updates, report


def apply_updates(updates):
    for table, id_field in [
        ("phylum", "id_phylum"),
        ("class", "id_class"),
        ("orders", "id_order"),
        ("family", "id_family"),
        ("genus", "id_genus"),
        ("species", "id_species"),
    ]:
        table_updates = updates[table]
        print(f"Updating {len(table_updates)} rows in '{table}'...")
        for id_value, name_es in table_updates.items():
            supabase.table(table).update({"name_es": name_es}).eq(id_field, id_value).execute()
    print("Done.")


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/populate_name_es.py path/to/excel.xlsx")
        sys.exit(1)

    excel_path = sys.argv[1]

    print("Reading Excel...")
    es_tree = read_excel_tree(excel_path)

    print("Reading current database structure...")
    db_tree = read_db_tree()

    print("Aligning both trees...")
    updates, report = compare_and_collect(db_tree, es_tree)

    total_updates = sum(len(v) for v in updates.values())
    print(f"\nReady to translate {total_updates} rows across all tables.")

    if report:
        print(f"\n{len(report)} branch(es) had a mismatched count (partially translated, not blocking):")
        for line in report:
            print(" -", line)

    answer = input("\nApply these translations to the database now? [y/N]: ").strip().lower()

    if answer != "y":
        print("Cancelled. No changes were made to the database.")
        sys.exit(0)

    apply_updates(updates)


if __name__ == "__main__":
    main()