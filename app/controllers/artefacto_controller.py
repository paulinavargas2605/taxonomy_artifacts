from app.services.artefacto_service import (
    listar_artefactos,
    obtener_artefacto,
    crear_artefacto,
    actualizar_artefacto,
    eliminar_artefacto
)


def obtener_artefactos():
    return listar_artefactos()


def obtener_un_artefacto(id_artefacto):
    return obtener_artefacto(id_artefacto)


def registrar_artefacto(datos):
    return crear_artefacto(datos)


def modificar_artefacto(id_artefacto, datos):
    return actualizar_artefacto(id_artefacto, datos)


def borrar_artefacto(id_artefacto):
    return eliminar_artefacto(id_artefacto)