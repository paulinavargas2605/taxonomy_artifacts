"""
Create one artifact for every species that does not have one yet.

Usage:
    python scripts/seed_all_species.py [username]

    username : which user to assign as the creator of the new artifacts.
               Defaults to the first user found.

What it does:
1. Reads ALL species and ALL existing artifacts (page by page, because
   Supabase returns at most 1000 rows per request).
2. Works out which species still have no artifact.
3. Shows how many artifacts it would create and asks for confirmation.
4. Inserts them in batches, using a placeholder image URL (picsum.photos,
   seeded by species id so each artifact always shows the same image).

It is safe to run more than once: species that already have an artifact
are skipped, so a second run only fills in whatever is still missing.
"""

import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import supabase

PAGE_SIZE = 1000
BATCH_SIZE = 100
ACTIVE_PROBABILITY = 0.85  # share of new artifacts marked as active


def fetch_all(table, columns, order_by):
    rows = []
    start = 0

    while True:
        response = (
            supabase
            .table(table)
            .select(columns)
            .order(order_by)
            .range(start, start + PAGE_SIZE - 1)
            .execute()
        )

        batch = response.data or []
        rows.extend(batch)

        if len(batch) < PAGE_SIZE:
            break

        start += PAGE_SIZE

    return rows


def get_target_user(username=None):
    query = supabase.table("users").select("id_user, username")

    if username:
        query = query.eq("username", username)

    response = query.order("id_user").execute()

    if not response.data:
        raise RuntimeError(
            f"No user found{' with username ' + repr(username) if username else ''}. "
            "Create a user first."
        )

    return response.data[0]


def build_image_url(id_species):
    return f"https://picsum.photos/seed/artifact-{id_species}/500/500"


def build_artifact(species, user_id):
    return {
        "name": species["name"],
        "id_user": user_id,
        "id_species": species["id_species"],
        "image_url": build_image_url(species["id_species"]),
        "active": random.random() < ACTIVE_PROBABILITY,
    }


def insert_in_batches(rows):
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        supabase.table("artifact").insert(batch).execute()
        print(f"  Inserted {i + len(batch)}/{len(rows)}...")


def main():
    username = sys.argv[1] if len(sys.argv) > 1 else None

    user = get_target_user(username)
    print(f"Using user '{user['username']}' (id={user['id_user']}) as the creator.")

    print("Reading species and artifacts...")
    species = fetch_all("species", "id_species, name", "id_species")
    used_species_ids = {
        row["id_species"]
        for row in fetch_all("artifact", "id_species", "id_artifact")
    }

    missing = [s for s in species if s["id_species"] not in used_species_ids]

    print(f"Species in the database:               {len(species)}")
    print(f"Species that already have an artifact: {len(used_species_ids)}")
    print(f"Artifacts to create:                   {len(missing)}")

    if not missing:
        print("Every species already has an artifact. Nothing to do.")
        return

    answer = input("\nCreate them now? [y/N]: ").strip().lower()

    if answer != "y":
        print("Cancelled. No changes were made to the database.")
        return

    rows = [build_artifact(s, user["id_user"]) for s in missing]

    print(f"Inserting {len(rows)} artifact(s)...")
    insert_in_batches(rows)

    print("Done.")


if __name__ == "__main__":
    main()