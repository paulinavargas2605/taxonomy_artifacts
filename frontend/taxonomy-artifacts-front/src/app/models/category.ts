export interface Phylum {

  id_phylum: number;

  name: string;

  public_label?: string;

  public_description?: string;

}

export interface TaxonomicClass {

  id_class: number;

  name: string;

}

export interface Order {

  id_order: number;

  name: string;

}

export interface Family {

  id_family: number;

  name: string;

}

export interface Genus {

  id_genus: number;

  name: string;

}

export interface Species {

  id_species: number;

  name: string;

}
