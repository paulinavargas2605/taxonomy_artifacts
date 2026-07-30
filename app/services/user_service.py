from fastapi import HTTPException
from app.database.connection import supabase


def list_users():
    try:
        response = (
            supabase
            .table("usuario")
            .select("*")
            .execute()
        )

        return response.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while listing users."
        )


def get_user(id_usuario):
    try:
        response = (
            supabase
            .table("usuario")
            .select("*")
            .eq("id_usuario", id_usuario)
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
            .table("usuario")
            .select("correo")
            .eq("correo", data["correo"])
            .execute()
        )

        if email.data:
            raise HTTPException(
                status_code=409,
                detail="A user with that email already exists."
            )

        response = (
            supabase
            .table("usuario")
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


def update_user(id_usuario, data):
    try:
        # Check that the user exists
        user = (
            supabase
            .table("usuario")
            .select("id_usuario")
            .eq("id_usuario", id_usuario)
            .execute()
        )

        if not user.data:
            raise HTTPException(
                status_code=404,
                detail="The user does not exist."
            )

        response = (
            supabase
            .table("usuario")
            .update(data)
            .eq("id_usuario", id_usuario)
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


def delete_user(id_usuario):
    try:
        # Check that the user exists
        user = (
            supabase
            .table("usuario")
            .select("id_usuario")
            .eq("id_usuario", id_usuario)
            .execute()
        )

        if not user.data:
            raise HTTPException(
                status_code=404,
                detail="The user does not exist."
            )

        response = (
            supabase
            .table("usuario")
            .delete()
            .eq("id_usuario", id_usuario)
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
