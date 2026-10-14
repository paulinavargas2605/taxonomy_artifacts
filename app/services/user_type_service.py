from fastapi import HTTPException
from app.database.connection import supabase


def list_user_types():
    try:
        response = (
            supabase
            .table("user_type")
            .select("id_user_type, name")
            .order("id_user_type")
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing user types."
        )