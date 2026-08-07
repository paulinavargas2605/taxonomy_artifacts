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
