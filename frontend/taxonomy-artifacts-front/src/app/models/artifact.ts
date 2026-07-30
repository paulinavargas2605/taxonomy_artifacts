// NOTE: field names below match the JSON contract with the backend / database
// (kept in Spanish on purpose) — do not rename them.
export interface Artifact {

  id_artefacto?: number;

  nombre: string;

  id_usuario: number;

  id_especie: number;

  url_imagen: string;

  activo: boolean;

}
