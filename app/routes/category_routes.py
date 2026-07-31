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


@router.get("/phyla")
def phyla():
    return get_phyla()


@router.get("/classes")
def classes(id_phylum: int):
    return get_classes(id_phylum)


@router.get("/orders")
def orders(id_class: int):
    return get_orders(id_class)


@router.get("/families")
def families(id_order: int):
    return get_families(id_order)


@router.get("/genera")
def genera(id_family: int):
    return get_genera(id_family)


@router.get("/species")
def species(id_genus: int):
    return get_species(id_genus)
