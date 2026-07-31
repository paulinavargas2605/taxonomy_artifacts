from pydantic import BaseModel
from typing import Optional


class ArtifactCreate(BaseModel):
    name: str
    id_user: int
    image_url: str
    active: bool
    id_species: int

class ArtifactUpdate(BaseModel):
    name: Optional[str] = None
    id_user: Optional[int] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None
    id_species: Optional[int] = None
