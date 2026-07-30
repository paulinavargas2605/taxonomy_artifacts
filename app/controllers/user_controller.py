from app.services.user_service import (
    list_users,
    get_user,
    create_user,
    update_user,
    delete_user
)


def get_all_users():
    return list_users()


def get_one_user(id_usuario):
    return get_user(id_usuario)


def register_user(data):
    return create_user(data)


def modify_user(id_usuario, data):
    return update_user(id_usuario, data)


def remove_user(id_usuario):
    return delete_user(id_usuario)
