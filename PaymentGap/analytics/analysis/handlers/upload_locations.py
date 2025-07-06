import pandas as pd
from .db_utils import get_or_create_fk

def insert_locations(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela LOCATIONS din dataframe-ul df.
    Suportă două moduri:
      - raw: coloanele 'id_location' și 'id_country' prezente
      - user-friendly: coloanele 'country'/'country_name' și 'city'/'city_name' prezente
    Evită duplicatele prin SELECT+UPDATE/INSERT în friendly mode,
    și ON DUPLICATE KEY UPDATE în raw mode.
    Returnează numărul de rânduri procesate.
    """
    # Normalizează header-ele: strip, lowercase, whitespace -> underscore
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # Redenumește coloane pentru user-friendly
    if 'country' in df.columns and 'country_name' not in df.columns:
        df.rename(columns={'country': 'country_name'}, inplace=True)
    if 'city' in df.columns and 'city_name' not in df.columns:
        df.rename(columns={'city': 'city_name'}, inplace=True)

    # Normalizează valorile textuale
    if 'country_name' in df.columns:
        df['country_name'] = df['country_name'].astype(str).str.strip()
    df['city_name'] = df['city_name'].astype(str).str.strip()

    # Determină modul de import
    friendly_mode = 'country_name' in df.columns

    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    count = 0
    for _, row in df.iterrows():
        if friendly_mode:
            # find-or-create country
            id_country = get_or_create_fk(
                cursor,
                table='COUNTRIES',
                lookup_col='country_name',
                lookup_val=row['country_name']
            )
            # ignorăm id_location din Excel
            id_location = None
        else:
            # raw mode
            id_country  = safe_int(row.get('id_country'))
            id_location = safe_int(row.get('id_location'))

        city_name = row['city_name']

        if id_location is not None:
            # RAW MODE: upsert după PK id_location
            cursor.execute(
                """
                INSERT INTO locations (
                    id_location, id_country, city_name
                ) VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    id_country = VALUES(id_country),
                    city_name  = VALUES(city_name)
                """,
                (id_location, id_country, city_name)
            )
        else:
            # FRIENDLY MODE: select+update/insert după (city_name, id_country)
            cursor.execute(
                "SELECT id_location FROM locations WHERE city_name = %s AND id_country = %s",
                (city_name, id_country)
            )
            existing = cursor.fetchone()
            if existing:
                cursor.execute(
                    """
                    UPDATE locations
                       SET city_name = %s, id_country = %s
                     WHERE id_location = %s
                    """,
                    (city_name, id_country, existing[0])
                )
            else:
                cursor.execute(
                    "INSERT INTO locations (city_name, id_country) VALUES (%s, %s)",
                    (city_name, id_country)
                )

        count += 1

    return count
