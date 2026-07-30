from fastapi import APIRouter
from app.schemas.artifact import ArtifactCreate, ArtifactUpdate
from app.controllers.artifact_controller import (
    get_all_artifacts,
    get_one_artifact,
    register_artifact,
    modify_artifact,
    remove_artifact
)

router = APIRouter(prefix="/artifacts", tags=["Artifacts"])


@router.get("/")
def list_endpoint():
    return get_all_artifacts()


@router.get("/{id_artefacto}")
def get_endpoint(id_artefacto: int):
    return get_one_artifact(id_artefacto)


@router.post("/")
def create_endpoint(data: ArtifactCreate):
    return register_artifact(data.model_dump())


@router.put("/{id_artefacto}")
def update_endpoint(id_artefacto: int, data: ArtifactUpdate):
    return modify_artifact(id_artefacto, data.model_dump(exclude_unset=True))


@router.delete("/{id_artefacto}")
def delete_endpoint(id_artefacto: int):
    return remove_artifact(id_artefacto)
