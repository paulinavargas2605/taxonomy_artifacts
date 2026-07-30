from pydantic import BaseModel
from typing import Optional


# NOTE: field names below match the database columns in Supabase
# (kept in Spanish on purpose) — do not rename them.
class ArtifactCreate(BaseModel):
    nombre: str
    id_usuario: int
    url_imagen: str
    activo: bool
    id_especie: int

class ArtifactUpdate(BaseModel):
    nombre: Optional[str] = None
    id_usuario: Optional[int] = None
    url_imagen: Optional[str] = None
    activo: Optional[bool] = None
    id_especie: Optional[int] = None
