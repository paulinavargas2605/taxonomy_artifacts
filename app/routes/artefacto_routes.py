from fastapi import APIRouter
from app.schemas.artefacto import ArtefactoCrear, ArtefactoActualizar
from app.controllers.artefacto_controller import (
    obtener_artefactos,
    obtener_un_artefacto,
    registrar_artefacto,
    modificar_artefacto,
    borrar_artefacto
)

router = APIRouter(prefix="/artefactos", tags=["Artefactos"])


@router.get("/")
def listar():
    return obtener_artefactos()


@router.get("/{id_artefacto}")
def obtener(id_artefacto: int):
    return obtener_un_artefacto(id_artefacto)


@router.post("/")
def crear(datos: ArtefactoCrear):
    return registrar_artefacto(datos.model_dump())


@router.put("/{id_artefacto}")
def actualizar(id_artefacto: int, datos: ArtefactoActualizar):
    return modificar_artefacto(
        id_artefacto,
        datos.model_dump(exclude_unset=True)
    )


@router.delete("/{id_artefacto}")
def eliminar(id_artefacto: int):
    return borrar_artefacto(id_artefacto)