from fastapi import HTTPException
from app.database.connection import supabase
from app.utils.security import verify_password


def login(username: str, password: str):
    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .eq("username", username)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password."
            )

        user = response.data[0]

        if not verify_password(password, user["password_hash"]):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password."
            )

        user.pop("password_hash", None)

        return user

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An error occurred during login."
        )