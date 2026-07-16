from fastapi import FastAPI
from app.routes.usuario_routes import router as usuario_router
from app.routes.artefacto_routes import router as artefacto_router

app = FastAPI(
    title="API Taxonomía de Artefactos",
    version="1.0"
)

app.include_router(usuario_router)
app.include_router(artefacto_router)


@app.get("/")
def inicio():
    return {"mensaje": "API funcionando correctamente"}