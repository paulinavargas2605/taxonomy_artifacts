from app.services.usuario_service import (
    listar_usuarios,
    obtener_usuario,
    crear_usuario,
    actualizar_usuario,
    eliminar_usuario
)


def obtener_usuarios():
    return listar_usuarios()


def obtener_un_usuario(id_usuario):
    return obtener_usuario(id_usuario)


def registrar_usuario(datos):
    return crear_usuario(datos)


def modificar_usuario(id_usuario, datos):
    return actualizar_usuario(id_usuario, datos)


def borrar_usuario(id_usuario):
    return eliminar_usuario(id_usuario)