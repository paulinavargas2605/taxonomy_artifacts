// NOTE: field names below match the JSON contract with the backend / database
// (kept in Spanish on purpose) — do not rename them.
export interface User {

  id_usuario?: number;

  nombre_usuario: string;

  correo: string;

  contrasena_hash: string;

  id_tipo_usuario: number;

}
