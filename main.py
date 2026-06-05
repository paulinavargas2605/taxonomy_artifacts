from config import supabase

""""
resultado = (
    supabase
    .table("tipo_usuario")
    .select("*")
    .execute()
)
"""

print(resultado.data)