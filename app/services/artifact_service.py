from fastapi import HTTPException
from app.database.connection import supabase


def list_artifacts():
    try:
        response = (
            supabase
            .table("artefacto")
            .select("*")
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing artifacts."
        )


def get_artifact(id_artefacto):
    try:
        response = (
            supabase
            .table("artefacto")
            .select("*")
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="The artifact does not exist."
            )

        return response.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching the artifact."
        )


def create_artifact(data):
    try:
        response = (
            supabase
            .table("artefacto")
            .insert(data)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating the artifact."
        )


def update_artifact(id_artefacto, data):
    try:
        response = (
            supabase
            .table("artefacto")
            .update(data)
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the artifact."
        )


def delete_artifact(id_artefacto):
    try:
        response = (
            supabase
            .table("artefacto")
            .delete()
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deleting the artifact."
        )
