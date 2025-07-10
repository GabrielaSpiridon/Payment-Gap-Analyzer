import pandas as pd
from .db_utils import get_or_create_fk

def insert_regions(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela REGIONS din dataframe-ul df.
    Suportă două moduri:
      - raw mode: folosește id-uri directe (id_region)
      - friendly mode: folosește doar region_name (fără id_region în Excel),
        evitând duplicatele după UNIQUE(region_name)
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # 2) Redenumește 'region' -> 'region_name' dacă e cazul
    if 'region' in df.columns and 'region_name' not in df.columns:
        df.rename(columns={'region': 'region_name'}, inplace=True)

    # 3) Detect friendly vs raw
    friendly = 'region_name' in df.columns

    def safe_int(v):
        return int(v) if pd.notnull(v) else None

    count = 0
    for _, row in df.iterrows():
        region_name = row['region_name'].strip() if friendly else None
        if friendly:
            # friendly mode: ignorăm id_region din Excel
            # inserăm folosind UNIQUE(region_name)
            cursor.execute("""
                INSERT INTO regions (region_name)
                     VALUES (%s)
                ON DUPLICATE KEY UPDATE
                     region_name = VALUES(region_name)
            """, (region_name,))
        else:
            # raw mode: folosim id_region + upsert
            id_region = safe_int(row.get('id_region'))
            region_name = row['region_name'] if 'region_name' in df.columns else None
            cursor.execute("""
                INSERT INTO regions (id_region, region_name)
                     VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE
                     region_name = VALUES(region_name)
            """, (id_region, region_name))
        count += 1

    return count