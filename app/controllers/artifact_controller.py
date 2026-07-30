from app.services.artifact_service import (
    list_artifacts,
    get_artifact,
    create_artifact,
    update_artifact,
    delete_artifact
)


def get_all_artifacts():
    return list_artifacts()


def get_one_artifact(id_artefacto):
    return get_artifact(id_artefacto)


def register_artifact(data):
    return create_artifact(data)


def modify_artifact(id_artefacto, data):
    return update_artifact(id_artefacto, data)


def remove_artifact(id_artefacto):
    return delete_artifact(id_artefacto)
