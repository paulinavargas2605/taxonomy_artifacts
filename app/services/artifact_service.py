import uuid
import os

from fastapi import HTTPException
from app.database.connection import supabase

BUCKET_NAME = "artifact-images"
DUPLICATE_ARTIFACT_MESSAGE = "An artifact for this species already exists."


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

        return response.data[0]

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching the artifact."
        )


def _is_duplicate_error(error: Exception) -> bool:
    text = str(error).lower()
    return "23505" in text or "duplicate key" in text


def create_artifact(data):
    try:
        existing = (
            supabase
            .table("artifact")
            .select("id_artifact")
            .eq("id_species", data["id_species"])
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=409,
                detail=DUPLICATE_ARTIFACT_MESSAGE
            )

        response = (
            supabase
            .table("artifact")
            .insert(data)
            .execute()
        )

        return response.data

    except HTTPException:
        raise

    except Exception as e:
        if _is_duplicate_error(e):
            raise HTTPException(
                status_code=409,
                detail=DUPLICATE_ARTIFACT_MESSAGE
            )

        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating the artifact."
        )


def update_artifact(id_artifact, data):
    try:
        if data.get("id_species") is not None:
            existing = (
                supabase
                .table("artifact")
                .select("id_artifact")
                .eq("id_species", data["id_species"])
                .neq("id_artifact", id_artifact)
                .execute()
            )

            if existing.data:
                raise HTTPException(
                    status_code=409,
                    detail=DUPLICATE_ARTIFACT_MESSAGE
                )

        response = (
            supabase
            .table("artifact")
            .update(data)
            .eq("id_artifact", id_artifact)
            .execute()
        )

        return response.data

    except HTTPException:
        raise

    except Exception as e:
        if _is_duplicate_error(e):
            raise HTTPException(
                status_code=409,
                detail=DUPLICATE_ARTIFACT_MESSAGE
            )

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


def get_classified_artifact(id_artifact):
    try:
        response = (
            supabase
            .table("classified_artifact")
            .select("*")
            .eq("id_artifact", id_artifact)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="The artifact does not exist."
            )

        return response.data[0]

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching the classified artifact."
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

def _fetch_all(table, order_by, page_size=1000):
    rows = []
    start = 0

    while True:
        response = (
            supabase
            .table(table)
            .select("*")
            .order(order_by)
            .range(start, start + page_size - 1)
            .execute()
        )

        batch = response.data or []
        rows.extend(batch)

        if len(batch) < page_size:
            break

        start += page_size

    return rows


def list_artifacts():
    try:
        return _fetch_all("artifact", "id_artifact")

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing artifacts."
        )


def list_classified_artifacts():
    try:
        return _fetch_all("classified_artifact", "id_artifact")

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing the classified artifacts."
        )