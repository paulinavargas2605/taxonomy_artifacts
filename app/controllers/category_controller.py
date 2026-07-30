from app.services.category_service import (
    list_phyla,
    list_classes,
    list_orders,
    list_families,
    list_genera,
    list_species
)


def get_phyla():
    return list_phyla()


def get_classes(id_filo):
    return list_classes(id_filo)


def get_orders(id_clase):
    return list_orders(id_clase)


def get_families(id_orden):
    return list_families(id_orden)


def get_genera(id_familia):
    return list_genera(id_familia)


def get_species(id_genero):
    return list_species(id_genero)
