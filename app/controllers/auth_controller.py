from app.services.auth_service import login


def do_login(data):
    return login(data["username"], data["password"])