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


@router.get("/{id_artifact}")
def get_endpoint(id_artifact: int):
    return get_one_artifact(id_artifact)


@router.post("/")
def create_endpoint(data: ArtifactCreate):
    return register_artifact(data.model_dump())


@router.put("/{id_artifact}")
def update_endpoint(id_artifact: int, data: ArtifactUpdate):
    return modify_artifact(id_artifact, data.model_dump(exclude_unset=True))


@router.delete("/{id_artifact}")
def delete_endpoint(id_artifact: int):
    return remove_artifact(id_artifact)
