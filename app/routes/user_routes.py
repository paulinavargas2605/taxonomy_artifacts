from fastapi import APIRouter
from app.schemas.user import UserCreate, UserUpdate
from app.controllers.user_controller import (
    get_all_users,
    get_one_user,
    register_user,
    modify_user,
    remove_user
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def list_endpoint():
    return get_all_users()


@router.get("/{id_usuario}")
def get_endpoint(id_usuario: int):
    return get_one_user(id_usuario)

@router.post("/")
def create_endpoint(data: UserCreate):
    return register_user(data.model_dump())


@router.put("/{id_usuario}")
def update_endpoint(id_usuario: int, data: UserUpdate):
    return modify_user(id_usuario, data.model_dump(exclude_unset=True))


@router.delete("/{id_usuario}")
def delete_endpoint(id_usuario: int):
    return remove_user(id_usuario)
