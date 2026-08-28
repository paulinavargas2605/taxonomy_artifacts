from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.user_routes import router as user_router
from app.routes.artifact_routes import router as artifact_router
from app.routes.category_routes import router as category_router
from app.routes.auth_routes import router as auth_router

app = FastAPI(
    title="Artifact Taxonomy API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(artifact_router)
app.include_router(category_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "API running correctly"}