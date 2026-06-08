from config import supabase

# Eliminar un registro
resultado_eliminar = (
    supabase
    .table("tipo_usuario")
    .delete()
    .eq("nombre", "Administrador")
    .execute()
)

# Insertar registro
resultado_insertar = (
    supabase
    .table("tipo_usuario")
    .insert(
        {
            "nombre": "Administrador"
        }
    )
    .execute()
)

print(resultado_eliminar.data)

""""
# Leer todos los registros
resultado_leer_todo = (
    supabase
    .table("tipo_usuario")
    .select("*")
    .execute()
)

# Leer filtrando
resultado_leer_filtrado = (
    supabase
    .table("tipo_usuario")
    .select("*")
    .eq("nombre", "Administrador")
    .execute()
)

# Actualizar un registro
resultado_actualizar = (
    supabase
    .table("tipo_usuario")
    .update(
        {
            "nombre": "Administrador General"
        }
    )
    .eq("nombre", "Administrador")
    .execute()
)



# print(resultado.data)
"""