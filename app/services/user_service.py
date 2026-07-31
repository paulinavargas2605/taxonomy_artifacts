from fastapi import HTTPException
from app.database.connection import supabase


def list_users():
    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing users."
        )


def get_user(id_user):
    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .eq("id_user", id_user)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="The user does not exist."
            )

        return response.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching the user."
        )


def create_user(data):
    try:
        # Check whether the email is already in use
        email = (
            supabase
            .table("users")
            .select("email")
            .eq("email", data["email"])
            .execute()
        )

        if email.data:
            raise HTTPException(
                status_code=409,
                detail="A user with that email already exists."
            )

        response = (
            supabase
            .table("users")
            .insert(data)
            .execute()
        )

        return response.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while creating the user."
        )


def update_user(id_user, data):
    try:
        # Check that the user exists
        user = (
            supabase
            .table("users")
            .select("id_user")
            .eq("id_user", id_user)
            .execute()
        )

        if not user.data:
            raise HTTPException(
                status_code=404,
                detail="The user does not exist."
            )

        response = (
            supabase
            .table("users")
            .update(data)
            .eq("id_user", id_user)
            .execute()
        )

        return response.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while updating the user."
        )


def delete_user(id_user):
    try:
        # Check that the user exists
        user = (
            supabase
            .table("users")
            .select("id_user")
            .eq("id_user", id_user)
            .execute()
        )

        if not user.data:
            raise HTTPException(
                status_code=404,
                detail="The user does not exist."
            )

        response = (
            supabase
            .table("users")
            .delete()
            .eq("id_user", id_user)
            .execute()
        )

        return response.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while deleting the user."
        )
