from app.services.category_service import (
    list_phyla,
    list_classes,
    list_orders,
    list_families,
    list_genera,
    list_species,
    get_species_by_id
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


def get_one_species(id_species):
    return get_species_by_id(id_species)