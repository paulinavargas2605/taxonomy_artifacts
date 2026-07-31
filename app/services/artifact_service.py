from fastapi import HTTPException
from app.database.connection import supabase


def list_artifacts():
    try:
        response = (
            supabase
            .table("artifact")
            .select("*")
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing artifacts."
        )


def get_artifact(id_artifact):
    try:
        response = (
            supabase
            .table("artifact")
            .select("*")
            .eq("id_artifact", id_artifact)
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
            .table("artifact")
            .insert(data)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating the artifact."
        )


def update_artifact(id_artifact, data):
    try:
        response = (
            supabase
            .table("artifact")
            .update(data)
            .eq("id_artifact", id_artifact)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the artifact."
        )


def delete_artifact(id_artifact):
    try:
        response = (
            supabase
            .table("artifact")
            .delete()
            .eq("id_artifact", id_artifact)
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deleting the artifact."
        )
