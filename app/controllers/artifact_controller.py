from app.services.artifact_service import (
    list_artifacts,
    get_artifact,
    create_artifact,
    update_artifact,
    delete_artifact,
    upload_artifact_image,
    get_classified_artifact
)


def upload_image(file_bytes, filename, content_type):
    return upload_artifact_image(file_bytes, filename, content_type)


def get_all_artifacts():
    return list_artifacts()


def get_one_artifact(id_artifact):
    return get_artifact(id_artifact)


def get_classified(id_artifact):
    return get_classified_artifact(id_artifact)


def register_artifact(data):
    return create_artifact(data)


def modify_artifact(id_artifact, data):
    return update_artifact(id_artifact, data)


def remove_artifact(id_artifact):
    return delete_artifact(id_artifact)