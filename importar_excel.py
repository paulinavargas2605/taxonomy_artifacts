import pandas as pd

df = pd.read_excel("datos/Taxonomia general reescrita normalizada.xlsx")

filos = df["Filo"].drop_duplicates()

print(filos)

# Nos quedamos aqui, ya me lee los filos, pero todavía no los puedo insertar porque hay una 
# llave foranea con artefacto y creo que eso hay que solucionarlo primero

"""
print(df.head())
print()
print(df.columns)
print()
print(df.shape)}
"""