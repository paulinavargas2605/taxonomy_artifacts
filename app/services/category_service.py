from fastapi import HTTPException
from app.database.connection import supabase


def list_phyla():
    try:
        response = (
            supabase
            .table("phylum")
            .select("id_phylum, name, public_description")
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Phyla.")


def list_classes(id_phylum: int):
    try:
        response = (
            supabase
            .table("class")
            .select("id_class, name")
            .eq("id_phylum", id_phylum)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Classes.")


def list_orders(id_class: int):
    try:
        response = (
            supabase
            .table("orders")
            .select("id_order, name")
            .eq("id_class", id_class)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Orders.")


def list_families(id_order: int):
    try:
        response = (
            supabase
            .table("family")
            .select("id_family, name")
            .eq("id_order", id_order)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Families.")


def list_genera(id_family: int):
    try:
        response = (
            supabase
            .table("genus")
            .select("id_genus, name")
            .eq("id_family", id_family)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Genera.")


def list_species(id_genus: int):
    try:
        response = (
            supabase
            .table("species")
            .select("id_species, name")
            .eq("id_genus", id_genus)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Species.")


def get_species_by_id(id_species: int):
    try:
        response = (
            supabase
            .table("species")
            .select("id_species, name")
            .eq("id_species", id_species)
            .execute()
        )

        if not response.data:
            raise HTTPException(status_code=404, detail="Species not found.")

        return response.data[0]
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error fetching the species.")


def _get_one(table: str, id_field: str, id_value: int, select: str):
    response = (
        supabase
        .table(table)
        .select(select)
        .eq(id_field, id_value)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


def get_classification_chain(id_species: int):
    try:
        species = _get_one(
            "species", "id_species", id_species,
            "id_species, name, id_genus"
        )

        if not species:
            raise HTTPException(status_code=404, detail="Species not found.")

        genus = _get_one(
            "genus", "id_genus", species["id_genus"],
            "id_genus, name, id_family"
        )

        family = _get_one(
            "family", "id_family", genus["id_family"],
            "id_family, name, id_order"
        ) if genus else None

        order = _get_one(
            "orders", "id_order", family["id_order"],
            "id_order, name, id_class"
        ) if family else None

        taxonomic_class = _get_one(
            "class", "id_class", order["id_class"],
            "id_class, name, id_phylum"
        ) if order else None

        phylum = _get_one(
            "phylum", "id_phylum", taxonomic_class["id_phylum"],
            "id_phylum, name, public_description"
        ) if taxonomic_class else None

        return {
            "species": species,
            "genus": genus,
            "family": family,
            "order": order,
            "class": taxonomic_class,
            "phylum": phylum
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error building the classification chain."
        )