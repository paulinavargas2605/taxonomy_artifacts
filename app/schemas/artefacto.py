from pydantic import BaseModel
from typing import Optional


class ArtefactoCrear(BaseModel):
    nombre: str
    id_usuario: int
    url_imagen: str
    activo: bool


class ArtefactoActualizar(BaseModel):
    nombre: Optional[str] = None
    id_usuario: Optional[int] = None
    url_imagen: Optional[str] = None
    activo: Optional[bool] = None