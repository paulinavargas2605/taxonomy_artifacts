from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCrear(BaseModel):
    nombre_usuario: str
    correo: EmailStr
    contrasena_hash: str
    id_tipo_usuario: int


class UsuarioActualizar(BaseModel):
    nombre_usuario: Optional[str] = None
    correo: Optional[EmailStr] = None
    contrasena_hash: Optional[str] = None
    id_tipo_usuario: Optional[int] = None