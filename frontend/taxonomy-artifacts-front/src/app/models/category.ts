// NOTE: "Filo", "Clase", "Orden", "Familia", "Genero" and "Especie" match the
// database table names in Supabase (kept in Spanish on purpose) — do not rename them.

export interface Filo {

  id_filo: number;

  nombre: string;

  etiqueta_publica?: string;

  descripcion_publica?: string;

}

export interface Clase {

  id_clase: number;

  nombre: string;

}

export interface Orden {

  id_orden: number;

  nombre: string;

}

export interface Familia {

  id_familia: number;

  nombre: string;

}

export interface Genero {

  id_genero: number;

  nombre: string;

}

export interface Especie {

  id_especie: number;

  nombre: string;

}
