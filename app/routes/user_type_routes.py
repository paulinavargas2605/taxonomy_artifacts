from fastapi import APIRouter
from app.controllers.user_type_controller import get_all_user_types

router = APIRouter(prefix="/user-types", tags=["User Types"])


@router.get("/")
def list_endpoint():
    return get_all_user_types()