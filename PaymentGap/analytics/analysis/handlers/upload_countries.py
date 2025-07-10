import pandas as pd
from .db_utils import get_or_create_fk

def insert_countries(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela COUNTRIES din dataframe-ul df.
    - Friendly mode: dacă ai coloana 'region' sau 'region_name', atunci
      * nu* ții cont de 'id_country' din Excel și folosești country_name+id_region
      ca un combinat unic (SELECT+UPDATE/INSERT).
    - Raw mode: dacă lipsește coloana 'region_name', atunci lucrezi pe
      id_region + id_country și folosești ON DUPLICATE KEY UPDATE.
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )

    # 2) Redenumește ușor coloane prietenoase
    if 'region' in df.columns and 'region_name' not in df.columns:
        df.rename(columns={'region':'region_name'}, inplace=True)
    if 'country' in df.columns and 'country_name' not in df.columns:
        df.rename(columns={'country':'country_name'}, inplace=True)

    # 3) Decide modul de import după prezența coloanei `region_name`
    friendly_mode = 'region_name' in df.columns

    # 4) Normalizează valorile textuale (trim)
    df['country_name'] = df['country_name'].astype(str).str.strip()
    if friendly_mode:
        df['region_name'] = df['region_name'].astype(str).str.strip()

    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    count = 0
    for _, row in df.iterrows():
        # În friendly_mode IGNORĂ complet orice id_country din Excel
        if friendly_mode:
            # find-or-create region
            id_region = get_or_create_fk(
                cursor,
                table='REGIONS',
                lookup_col='region_name',
                lookup_val=row['region_name']
            )
            # raw id_country = None
            id_country = None
        else:
            # RAW mode: folosește explicit id_region și id_country
            id_region  = safe_int(row['id_region'])
            id_country = safe_int(row['id_country'])

        country_name = row['country_name']

        if id_country is not None:
            # RAW MODE: upsert după PK id_country
            cursor.execute("""
                INSERT INTO countries (id_country, country_name, id_region)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                  country_name = VALUES(country_name),
                  id_region    = VALUES(id_region)
            """, (id_country, country_name, id_region))

        else:
            # FRIENDLY MODE: SELECT pe (country_name, id_region)
            cursor.execute(
                "SELECT id_country FROM countries WHERE country_name = %s AND id_region = %s",
                (country_name, id_region)
            )
            existing = cursor.fetchone()
            if existing:
                # actualizează
                cursor.execute("""
                    UPDATE countries
                       SET country_name = %s, id_region = %s
                     WHERE id_country = %s
                """, (country_name, id_region, existing[0]))
            else:
                # inserare nouă
                cursor.execute("""
                    INSERT INTO countries (country_name, id_region)
                    VALUES (%s, %s)
                """, (country_name, id_region))

        count += 1

    return count