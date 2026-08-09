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

  genus: string;

  family: string;

  order_name: string;

  class: string;

  phylum: string;

}