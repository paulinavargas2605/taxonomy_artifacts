export interface Artifact {

  id_artifact?: number;

  name: string;

  id_user: number;

  id_species: number;

  image_url: string;

  active: boolean;

}

export interface ClassifiedArtifact {

  id_artifact: number;

  name: string;

  id_user: number;

  image_url: string;

  species: string;
  species_es?: string;

  genus: string;
  genus_es?: string;

  family: string;
  family_es?: string;

  order_name: string;
  order_name_es?: string;

  class: string;
  class_es?: string;

  phylum: string;
  phylum_es?: string;

}