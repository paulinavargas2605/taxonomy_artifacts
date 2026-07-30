from fastapi import HTTPException
from app.database.connection import supabase


# NOTE: "filo", "clase", "orden", "familia", "genero" and "especie" are the
# literal table/column names in Supabase (kept in Spanish on purpose) —
# do not rename them.

def list_phyla():
    try:
        response = (
            supabase
            .table("filo")
            .select("id_filo, nombre, etiqueta_publica, descripcion_publica")
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Phyla.")


def list_classes(id_filo: int):
    try:
        response = (
            supabase
            .table("clase")
            .select("id_clase, nombre")
            .eq("id_filo", id_filo)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Classes.")


def list_orders(id_clase: int):
    try:
        response = (
            supabase
            .table("orden")
            .select("id_orden, nombre")
            .eq("id_clase", id_clase)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Orders.")


def list_families(id_orden: int):
    try:
        response = (
            supabase
            .table("familia")
            .select("id_familia, nombre")
            .eq("id_orden", id_orden)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Families.")


def list_genera(id_familia: int):
    try:
        response = (
            supabase
            .table("genero")
            .select("id_genero, nombre")
            .eq("id_familia", id_familia)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Genera.")


def list_species(id_genero: int):
    try:
        response = (
            supabase
            .table("especie")
            .select("id_especie, nombre")
            .eq("id_genero", id_genero)
            .execute()
        )
        return response.data
    except Exception:
        raise HTTPException(status_code=500, detail="Error listing Species.")
