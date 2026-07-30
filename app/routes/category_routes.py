from fastapi import APIRouter
from app.controllers.category_controller import (
    get_phyla,
    get_classes,
    get_orders,
    get_families,
    get_genera,
    get_species
)

router = APIRouter(prefix="/categories", tags=["Categories"])


# NOTE: "filos", "clases", "ordenes", "familias", "generos" and "especies"
# match the database table names in Supabase (kept in Spanish on purpose).

@router.get("/filos")
def phyla():
    return get_phyla()


@router.get("/clases")
def classes(id_filo: int):
    return get_classes(id_filo)


@router.get("/ordenes")
def orders(id_clase: int):
    return get_orders(id_clase)


@router.get("/familias")
def families(id_orden: int):
    return get_families(id_orden)


@router.get("/generos")
def genera(id_familia: int):
    return get_genera(id_familia)


@router.get("/especies")
def species(id_genero: int):
    return get_species(id_genero)
