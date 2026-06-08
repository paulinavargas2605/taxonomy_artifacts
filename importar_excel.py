import pandas as pd
from config import supabase

df = pd.read_excel("datos/Taxonomia general reescrita normalizada.xlsx")

# Simulación de lo que vendría de Supabase
mapa_filos = {
    "Artefactos Físicos": 2,
    "Artefactos Informacionales-Simbólicos": 3,
    "Artefactos Físico-Informacionales": 4,
    "Artefactos Biológico-Biotecnológicos": 5,
    "Sustancias Técnicas": 6
}

clases_procesadas = set()

for _, fila in df.iterrows():

    nombre_clase = fila["Clase"]
    nombre_filo = fila["Filo"]

    if nombre_clase in clases_procesadas:
        continue

    clases_procesadas.add(nombre_clase)

    id_filo = mapa_filos[nombre_filo]

    # VERIFICAR SI YA EXISTE
    existe = (
        supabase
        .table("clase")
        .select("id_clase")
        .eq("nombre", nombre_clase)
        .eq("id_filo", id_filo)
        .execute()
    )

    if len(existe.data) > 0:
        print(f"Ya existe: {nombre_clase}")
        continue

    # SI NO EXISTE, INSERTAR
    resultado = (
        supabase
        .table("clase")
        .insert(
            {
                "nombre": nombre_clase,
                "id_filo": id_filo
            }
        )
        .execute()
    )

    print(f"Insertada: {nombre_clase}")


# Extrayendo las clases 

# clases = df["Clase"].drop_duplicates()









"""
Extranyendo los filos

filos = df["Filo"].drop_duplicates()

for filo in filos:
    print(f"Insertando: {filo}")

    supabase.table("filo").insert(
        {
            "nombre": filo
        }
    ).execute()
"""

"""
print(df.head())
print()
print(df.columns)
print()
print(df.shape)}
"""