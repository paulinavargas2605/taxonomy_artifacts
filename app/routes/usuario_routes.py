from fastapi import APIRouter
from app.schemas.usuario import UsuarioCrear, UsuarioActualizar
from app.controllers.usuario_controller import (
    obtener_usuarios,
    obtener_un_usuario,
    registrar_usuario,
    modificar_usuario,
    borrar_usuario
)

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.get("/")
def listar():
    return obtener_usuarios()


@router.get("/{id_usuario}")
def obtener(id_usuario: int):
    return obtener_un_usuario(id_usuario)

@router.post("/")
def crear(datos: UsuarioCrear):
    return registrar_usuario(datos.model_dump())


@router.put("/{id_usuario}")
def actualizar(id_usuario: int, datos: UsuarioActualizar):
    return modificar_usuario(id_usuario, datos.model_dump(exclude_unset=True))


@router.delete("/{id_usuario}")
def eliminar(id_usuario: int):
    return borrar_usuario(id_usuario)