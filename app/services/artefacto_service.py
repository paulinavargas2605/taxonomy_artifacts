from fastapi import HTTPException
from app.database.conexion import supabase


def listar_artefactos():
    try:
        respuesta = (
            supabase
            .table("artefacto")
            .select("*")
            .execute()
        )

        return respuesta.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al listar los artefactos."
        )


def obtener_artefacto(id_artefacto):
    try:
        respuesta = (
            supabase
            .table("artefacto")
            .select("*")
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        if not respuesta.data:
            raise HTTPException(
                status_code=404,
                detail="El artefacto no existe."
            )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al consultar el artefacto."
        )


def crear_artefacto(datos):
    try:
        respuesta = (
            supabase
            .table("artefacto")
            .insert(datos)
            .execute()
        )

        return respuesta.data

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al crear el artefacto."
        )


def actualizar_artefacto(id_artefacto, datos):
    try:
        artefacto = (
            supabase
            .table("artefacto")
            .select("id_artefacto")
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        if not artefacto.data:
            raise HTTPException(
                status_code=404,
                detail="El artefacto no existe."
            )

        respuesta = (
            supabase
            .table("artefacto")
            .update(datos)
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al actualizar el artefacto."
        )


def eliminar_artefacto(id_artefacto):
    try:
        artefacto = (
            supabase
            .table("artefacto")
            .select("id_artefacto")
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        if not artefacto.data:
            raise HTTPException(
                status_code=404,
                detail="El artefacto no existe."
            )

        respuesta = (
            supabase
            .table("artefacto")
            .delete()
            .eq("id_artefacto", id_artefacto)
            .execute()
        )

        return respuesta.data

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error al eliminar el artefacto."
        )