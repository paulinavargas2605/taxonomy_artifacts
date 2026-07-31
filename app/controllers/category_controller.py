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


def get_classes(id_phylum):
    return list_classes(id_phylum)


def get_orders(id_class):
    return list_orders(id_class)


def get_families(id_order):
    return list_families(id_order)


def get_genera(id_family):
    return list_genera(id_family)


def get_species(id_genus):
    return list_species(id_genus)
