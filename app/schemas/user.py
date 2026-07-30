from pydantic import BaseModel, EmailStr
from typing import Optional


# NOTE: field names below match the database columns in Supabase
# (kept in Spanish on purpose) — do not rename them.
class UserCreate(BaseModel):
    nombre_usuario: str
    correo: EmailStr
    contrasena_hash: str
    id_tipo_usuario: int


class UserUpdate(BaseModel):
    nombre_usuario: Optional[str] = None
    correo: Optional[EmailStr] = None
    contrasena_hash: Optional[str] = None
    id_tipo_usuario: Optional[int] = None
