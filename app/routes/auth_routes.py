from fastapi import APIRouter
from app.schemas.auth import LoginRequest
from app.controllers.auth_controller import do_login

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login_endpoint(data: LoginRequest):
    return do_login(data.model_dump())