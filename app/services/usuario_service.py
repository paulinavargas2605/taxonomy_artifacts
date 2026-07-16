from fastapi import HTTPException
from app.database.conexion import supabase


def listar_usuarios():
    try:
        respuesta = (
            supabase
            .table("usuario")
            .select("*")
            .execute()
        )

        return respuesta.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al listar los usuarios."
        )


def obtener_usuario(id_usuario):
    try:
        respuesta = (
            supabase
            .table("usuario")
            .select("*")
            .eq("id_usuario", id_usuario)
            .execute()
        )

        if not respuesta.data:
            raise HTTPException(
                status_code=404,
                detail="El usuario no existe."
            )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al consultar el usuario."
        )


def crear_usuario(datos):
    try:
        # Verificar si el correo ya existe
        correo = (
            supabase
            .table("usuario")
            .select("correo")
            .eq("correo", datos["correo"])
            .execute()
        )

        if correo.data:
            raise HTTPException(
                status_code=409,
                detail="Ya existe un usuario con ese correo."
            )

        respuesta = (
            supabase
            .table("usuario")
            .insert(datos)
            .execute()
        )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al crear el usuario."
        )


def actualizar_usuario(id_usuario, datos):
    try:
        # Verificar que el usuario exista
        usuario = (
            supabase
            .table("usuario")
            .select("id_usuario")
            .eq("id_usuario", id_usuario)
            .execute()
        )

        if not usuario.data:
            raise HTTPException(
                status_code=404,
                detail="El usuario no existe."
            )

        respuesta = (
            supabase
            .table("usuario")
            .update(datos)
            .eq("id_usuario", id_usuario)
            .execute()
        )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al actualizar el usuario."
        )


def eliminar_usuario(id_usuario):
    try:
        # Verificar que el usuario exista
        usuario = (
            supabase
            .table("usuario")
            .select("id_usuario")
            .eq("id_usuario", id_usuario)
            .execute()
        )

        if not usuario.data:
            raise HTTPException(
                status_code=404,
                detail="El usuario no existe."
            )

        respuesta = (
            supabase
            .table("usuario")
            .delete()
            .eq("id_usuario", id_usuario)
            .execute()
        )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al eliminar el usuario."
        )