import pandas as pd
from .db_utils import get_or_create_fk

def insert_company_entities(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela COMPANY_ENTITIES în mod user-friendly.
    Se folosesc doar coloanele prietenoase:
      - company_entity_name
      - region_name
      - country_name
      - company_name
      - department_name
    Orice rând:
      1. normalizează și redenumește headerele
      2. obține sau creează FK-urile (REGIONS, COUNTRIES, COMPANIES, DEPARTMENTS)
      3. face un INSERT ... ON DUPLICATE KEY UPDATE pentru a evita SELECT-uri
      4. utilizează LAST_INSERT_ID pentru a recupera id_company_entity
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # 2) Redenumiri prietenoase
    renames = {
        'company_entity': 'company_entity_name',
        'company_name': 'company_entity_name',
        'region':         'region_name',
        'country':        'country_name',
        'company':        'company_name',
        'department':     'department_name',
    }
    for src, dst in renames.items():
        if src in df.columns and dst not in df.columns:
            df.rename(columns={src: dst}, inplace=True)

    # Asigură strip și lowercase pentru text
    for col in ['company_entity_name', 'region_name', 'country_name', 'company_name', 'department_name']:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    count = 0
    for _, row in df.iterrows():
        # 3) FK lookup sau create
        id_region = get_or_create_fk(cursor, 'REGIONS',   'region_name', row['region_name'])
        id_country = get_or_create_fk(cursor, 'COUNTRIES', 'country_name', row['country_name'])
        id_company = get_or_create_fk(cursor, 'COMPANIES', 'company_name', row['company_name'])
        id_department = get_or_create_fk(cursor, 'DEPARTMENTS', 'department_name', row['department_name'])

        ent_name = row['company_entity_name']

        # 4) INSERT ... ON DUPLICATE KEY UPDATE
        cursor.execute(
            """
            INSERT INTO company_entities (
              company_entity_name,
              id_region, id_country,
              id_company, id_department
            ) VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
              id_region         = VALUES(id_region),
              id_country        = VALUES(id_country),
              id_company        = VALUES(id_company),
              id_department     = VALUES(id_department),
              id_company_entity = LAST_INSERT_ID(id_company_entity)
            """,
            (
                ent_name,
                id_region, id_country,
                id_company, id_department
            )
        )
        # obține mereu id-ul entității
        id_ce = cursor.lastrowid
        count += 1

    return count
