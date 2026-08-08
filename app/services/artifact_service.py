from fastapi import HTTPException
from app.database.connection import supabase
import uuid
import os

BUCKET_NAME = "artifact-images"

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

def upload_artifact_image(file_bytes: bytes, filename: str, content_type: str) -> str:
    try:
        ext = os.path.splitext(filename)[1] or ".jpg"
        unique_name = f"{uuid.uuid4()}{ext}"

        supabase.storage.from_(BUCKET_NAME).upload(
            path=unique_name,
            file=file_bytes,
            file_options={"content-type": content_type}
        )

        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(unique_name)

        return public_url
    
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while uploading the image."
        )
