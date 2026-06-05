import pandas as pd

df = pd.read_excel("datos/Taxonomia general reescrita normalizada.xlsx")

filos = df["Filo"].drop_duplicates()

print(filos)