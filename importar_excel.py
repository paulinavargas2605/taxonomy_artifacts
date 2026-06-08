import pandas as pd
from config import supabase

df = pd.read_excel("datos/Taxonomia general reescrita normalizada.xlsx")

def obtener_mapa(tabla, id_columna):

    respuesta = (
        supabase
        .table(tabla)
        .select(f"{id_columna}, nombre")
        .execute()
    )

    return {
        fila["nombre"]: fila[id_columna]
        for fila in respuesta.data
    }


def insertar_generos():

    mapa_familias = obtener_mapa("familia", "id_familia")

    generos_procesados = set()

    insertadas = 0
    existentes = 0

    for _, fila in df.iterrows():

        nombre_genero = fila["Genero"]
        nombre_familia = fila["Familia"]
        
        if nombre_genero in generos_procesados:
            continue

        generos_procesados.add(nombre_genero)

        id_familia = mapa_familias[nombre_familia]

        existe = (
            supabase
            .table("genero")
            .select("id_genero")
            .eq("nombre", nombre_genero)
            .eq("id_familia", id_familia)
            .execute()
        )

        if len(existe.data) > 0:
            existentes += 1
            continue

        (
            supabase
            .table("genero")
            .insert(
                {
                    "nombre": nombre_genero,
                    "id_familia": id_familia
                }
            )
            .execute()
        )

        insertadas += 1
        
        print(f"Generos insertadas: {insertadas}")

    print("\n--- Resumen ---")
    print(f"Generos ya existentes: {existentes}")
    print(f"Generos insertados: {insertadas}")

# --------------------------------------------------------------------------------------
def insertar_familias():

    mapa_ordenes = obtener_mapa("orden", "id_orden")

    familias_procesados = set()

    insertadas = 0
    existentes = 0

    for _, fila in df.iterrows():

        nombre_familia = fila["Familia"]
        nombre_orden = fila["Orden"]
        
        if nombre_familia in familias_procesados:
            continue

        familias_procesados.add(nombre_familia)

        id_orden = mapa_ordenes[nombre_orden]

        existe = (
            supabase
            .table("familia")
            .select("id_familia")
            .eq("nombre", nombre_familia)
            .eq("id_orden", id_orden)
            .execute()
        )

        if len(existe.data) > 0:
            existentes += 1
            continue

        (
            supabase
            .table("familia")
            .insert(
                {
                    "nombre": nombre_familia,
                    "id_orden": id_orden
                }
            )
            .execute()
        )

        insertadas += 1

        print("\n--- Resumen ---")
        print(f"Familias insertadas: {insertadas}")
        print(f"Familias ya existentes: {existentes}")

# --------------------------------------------------------------------------------------
def insertar_ordenes():

    mapa_clases = obtener_mapa("clase", "id_clase")

    ordenes_procesados = set()

    for _, fila in df.iterrows():

        nombre_orden = fila["Orden"]
        nombre_clase = fila["Clase"]
        
        if nombre_orden in ordenes_procesados:
            continue

        ordenes_procesados.add(nombre_orden)

        id_clase = mapa_clases[nombre_clase]

        existe = (
            supabase
            .table("orden")
            .select("id_orden")
            .eq("nombre", nombre_orden)
            .eq("id_clase", id_clase)
            .execute()
        )

        if len(existe.data) > 0:
            print(f"Ya existe: {nombre_orden}")
            continue

        (
            supabase
            .table("orden")
            .insert(
                {
                    "nombre": nombre_orden,
                    "id_clase": id_clase
                }
            )
            .execute()
        )

        print(f"Insertada: {nombre_orden}")

# --------------------------------------------------------------------------------------
def insertar_filos():
    filos = df["Filo"].drop_duplicates()

    for filo in filos:
        print(f"Insertando: {filo}")

        supabase.table("filo").insert(
            {
                "nombre": filo
            }
        ).execute()

# --------------------------------------------------------------------------------------
def insertar_clases():

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

        (
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

# --------------------------------------------------------------------------------------
def mostrar_informacion_excel():
    print(df.head())
    print()
    print(df.columns)
    print()
    print(df.shape)

# --------------------------------------------------------------------------------------
# ---------------------------
# EJECUTAR LO QUE NECESITES
# ---------------------------

insertar_generos()
# insertar_familias()
# insertar_ordenes()
# insertar_clases()
# insertar_filos()
# mostrar_informacion_excel()