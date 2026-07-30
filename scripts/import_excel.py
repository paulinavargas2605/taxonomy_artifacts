import pandas as pd

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.connection import supabase

df = pd.read_excel("data/Taxonomia nuevos.xlsx")

def get_map(table, id_column):
    data = []
    offset = 0
    page_size = 1000
    while True:
        response = (
            supabase
            .table(table)
            .select(f"{id_column}, nombre")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        data += response.data
        if len(response.data) < page_size:
            break
        offset += page_size

    return {row["nombre"]: row[id_column] for row in data}

def insert_species():

    genus_map = get_map("genero", "id_genero")

    processed_species = set()

    inserted = 0
    existing = 0

    for _, row in df.iterrows():

        species_name = row["Especie"]
        genus_name = row["Genero"]

        key = (species_name, genus_name)

        if key in processed_species:
            continue

        processed_species.add(key)

        print(
            f"Processing -> Genus: {genus_name} | "
            f"Species: {species_name}"
        )

        id_genero = genus_map[genus_name]

        exists = (
            supabase
            .table("especie")
            .select("id_especie")
            .eq("nombre", species_name)
            .eq("id_genero", id_genero)
            .execute()
        )

        if len(exists.data) > 0:
            existing += 1
            continue

        (
            supabase
            .table("especie")
            .insert(
                {
                    "nombre": species_name,
                    "id_genero": id_genero
                }
            )
            .execute()
        )

        inserted += 1

        print(f"Species inserted: {inserted}")
        print(f"Species already existing: {existing}")

# --------------------------------------------------------------------------------------
def insert_genera():

    family_map = get_map("familia", "id_familia")

    processed_genera = set()

    inserted = 0
    existing = 0

    for _, row in df.iterrows():

        genus_name = row["Genero"]
        family_name = row["Familia"]

        if genus_name in processed_genera:
            continue

        processed_genera.add(genus_name)

        id_familia = family_map[family_name]

        exists = (
            supabase
            .table("genero")
            .select("id_genero")
            .eq("nombre", genus_name)
            .eq("id_familia", id_familia)
            .execute()
        )

        if len(exists.data) > 0:
            existing += 1
            continue

        (
            supabase
            .table("genero")
            .insert(
                {
                    "nombre": genus_name,
                    "id_familia": id_familia
                }
            )
            .execute()
        )

        inserted += 1

        print(f"Genera inserted: {inserted}")

    print("\n--- Summary ---")
    print(f"Genera already existing: {existing}")
    print(f"Genera inserted: {inserted}")

# --------------------------------------------------------------------------------------
def insert_families():

    order_map = get_map("orden", "id_orden")

    processed_families = set()

    inserted = 0
    existing = 0

    for _, row in df.iterrows():

        family_name = row["Familia"]
        order_name = row["Orden"]

        if family_name in processed_families:
            continue

        processed_families.add(family_name)

        id_orden = order_map[order_name]

        exists = (
            supabase
            .table("familia")
            .select("id_familia")
            .eq("nombre", family_name)
            .eq("id_orden", id_orden)
            .execute()
        )

        if len(exists.data) > 0:
            existing += 1
            continue

        (
            supabase
            .table("familia")
            .insert(
                {
                    "nombre": family_name,
                    "id_orden": id_orden
                }
            )
            .execute()
        )

        inserted += 1

        print("\n--- Summary ---")
        print(f"Families inserted: {inserted}")
        print(f"Families already existing: {existing}")

# --------------------------------------------------------------------------------------
def insert_orders():

    class_map = get_map("clase", "id_clase")

    processed_orders = set()

    for _, row in df.iterrows():

        order_name = row["Orden"]
        class_name = row["Clase"]

        if order_name in processed_orders:
            continue

        processed_orders.add(order_name)

        id_clase = class_map[class_name]

        exists = (
            supabase
            .table("orden")
            .select("id_orden")
            .eq("nombre", order_name)
            .eq("id_clase", id_clase)
            .execute()
        )

        if len(exists.data) > 0:
            print(f"Already exists: {order_name}")
            continue

        (
            supabase
            .table("orden")
            .insert(
                {
                    "nombre": order_name,
                    "id_clase": id_clase
                }
            )
            .execute()
        )

        print(f"Inserted: {order_name}")

# --------------------------------------------------------------------------------------
def insert_phyla():
    phyla = df["Filo"].drop_duplicates()

    for phylum in phyla:
        print(f"Inserting: {phylum}")

        supabase.table("filo").insert(
            {
                "nombre": phylum
            }
        ).execute()

# --------------------------------------------------------------------------------------
def insert_classes():

    phylum_map = {
        "Artefactos Físicos": 2,
        "Artefactos Informacionales-Simbólicos": 3,
        "Artefactos Físico-Informacionales": 4,
        "Artefactos Biológico-Biotecnológicos": 5,
        "Sustancias Técnicas": 6
    }

    processed_classes = set()

    for _, row in df.iterrows():

        class_name = row["Clase"]
        phylum_name = row["Filo"]

        if class_name in processed_classes:
            continue

        processed_classes.add(class_name)

        id_filo = phylum_map[phylum_name]

        exists = (
            supabase
            .table("clase")
            .select("id_clase")
            .eq("nombre", class_name)
            .eq("id_filo", id_filo)
            .execute()
        )

        if len(exists.data) > 0:
            print(f"Already exists: {class_name}")
            continue

        (
            supabase
            .table("clase")
            .insert(
                {
                    "nombre": class_name,
                    "id_filo": id_filo
                }
            )
            .execute()
        )

        print(f"Inserted: {class_name}")

# --------------------------------------------------------------------------------------
def show_excel_info():
    print(df.head())
    print()
    print(df.columns)
    print()
    print(df.shape)

# --------------------------------------------------------------------------------------
# ---------------------------
# RUN WHATEVER YOU NEED
# ---------------------------

if __name__ == "__main__":
    print("Functions to insert data")
    # insert_species()
    # insert_genera()
    # insert_families()
    # insert_orders()
    # insert_classes()
    # insert_phyla()
    # show_excel_info()
