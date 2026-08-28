export interface Phylum {

  id_phylum: number;

  name: string;
  name_es?: string;

  public_description?: string;

}

export interface TaxonomicClass {

  id_class: number;

  name: string;
  name_es?: string;

}

export interface Order {

  id_order: number;

  name: string;
  name_es?: string;

}

export interface Family {

  id_family: number;

  name: string;
  name_es?: string;

}

export interface Genus {

  id_genus: number;

  name: string;
  name_es?: string;

}

export interface Species {

  id_species: number;

  name: string;
  name_es?: string;

}

export interface Classification {

  species: Species;
  genus: Genus | null;
  family: Family | null;
  order: Order | null;
  class: TaxonomicClass | null;
  phylum: Phylum | null;

}