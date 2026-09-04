"""
Seed the `artifact` table with random test data so the page has plenty
of records to browse.

Usage:
    python scripts/seed_artifacts.py [target_count] [username]

    target_count : minimum total number of artifacts you want in the
                    database afterward. Defaults to 300.
    username     : which user to assign as the creator of the new
                    artifacts. Defaults to the first user found.

What it does:
1. Counts how many artifacts already exist.
2. If there are already enough, does nothing.
3. Otherwise, picks that many species at random (avoiding species that
   already have an artifact, when possible) and creates one artifact
   per species, using a placeholder image URL (picsum.photos, seeded
   by species id so it's stable across runs).
"""

import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import supabase


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


def get_existing_artifact_count():
    response = supabase.table("artifact").select("id_artifact", count="exact").execute()
    return response.count or 0


def get_species_ids_already_used():
    response = supabase.table("artifact").select("id_species").execute()
    return {row["id_species"] for row in response.data}


def get_all_species():
    response = supabase.table("species").select("id_species, name").execute()
    return response.data


def build_image_url(id_species):
    return f"https://picsum.photos/seed/artifact-{id_species}/500/500"


def build_new_artifacts(count, user_id, species_pool):
    chosen = random.sample(species_pool, min(count, len(species_pool)))

    artifacts = []
    for sp in chosen:
        artifacts.append({
            "name": sp["name"],
            "id_user": user_id,
            "id_species": sp["id_species"],
            "image_url": build_image_url(sp["id_species"]),
            "active": random.random() < 0.85,
        })

    return artifacts


def insert_in_batches(rows, batch_size=100):
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        supabase.table("artifact").insert(batch).execute()
        print(f"  Inserted {i + len(batch)}/{len(rows)}...")


def main():
    target_count = int(sys.argv[1]) if len(sys.argv) > 1 else 300
    username = sys.argv[2] if len(sys.argv) > 2 else None

    user = get_target_user(username)
    print(f"Using user '{user['username']}' (id={user['id_user']}) as the creator.")

    existing_count = get_existing_artifact_count()
    print(f"Currently {existing_count} artifact(s) in the database.")

    missing = target_count - existing_count

    if missing <= 0:
        print(f"Already at or above {target_count}. Nothing to do.")
        return

    print(f"Need to create {missing} more artifact(s).")

    used_species_ids = get_species_ids_already_used()
    all_species = get_all_species()

    unused_species = [s for s in all_species if s["id_species"] not in used_species_ids]

    pool = unused_species if len(unused_species) >= missing else all_species
    if pool is all_species:
        print("Not enough unused species left; some species will get more than one artifact.")

    new_artifacts = build_new_artifacts(missing, user["id_user"], pool)

    print(f"Inserting {len(new_artifacts)} new artifact(s)...")
    insert_in_batches(new_artifacts)

    print("Done.")


if __name__ == "__main__":
    main()