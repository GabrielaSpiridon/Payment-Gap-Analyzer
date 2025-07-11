import pandas as pd
from .db_utils import get_or_create_fk
from datetime import date

def get_employee_id(cursor, email: str) -> int | None:
    """Caută în tabela employees după email și returnează id_employee."""
    if not email or pd.isna(email):
        return None
    cursor.execute(
        "SELECT id_employee FROM employees WHERE LOWER(email)=LOWER(%s) LIMIT 1",
        (email.strip(),)
    )
    row = cursor.fetchone()
    return row[0] if row else None

def insert_company_entities(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela company_entities din dataframe-ul df.
    - Friendly mode: după company_entity_name (UNIQUE), region_name, country_name, company_name, department_name, email_manager
    - Raw mode: după id_company_entity (PRIMARY KEY) și id_manager numeric
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )

    # 2) Redenumește coloane prietenoase
    renames = {
        'company_entity':    'company_entity_name',
        'company_name':      'company_entity_name',
        'region':            'region_name',
        'country':           'country_name',
        'company':           'company_name',
        'department':        'department_name',
        'manager_email':     'email_manager',
        'email_manager':     'email_manager',
        'email manager':     'email_manager',
        'email-manager':     'email_manager',
    }
    df.rename(columns={src: dst for src, dst in renames.items() if src in df.columns},
              inplace=True)

    # 3) Detect friendly vs raw
    friendly_entity    = 'company_entity_name'    in df.columns
    friendly_region    = 'region_name'            in df.columns
    friendly_country   = 'country_name'           in df.columns
    friendly_company   = 'company_name'           in df.columns
    friendly_department= 'department_name'        in df.columns
    friendly_mgr_email = 'email_manager'          in df.columns
    raw_id_entity      = 'id_company_entity'      in df.columns

    # 4) Converters
    def safe_int(v):
        return int(v) if pd.notnull(v) else None

    count = 0
    for i, row in df.iterrows():
        # --- FK lookup/create ---
        # region
        if friendly_region:
            id_region = get_or_create_fk(cursor,
                'REGIONS', 'region_name', row['region_name'].strip())
        else:
            id_region = safe_int(row.get('id_region'))

        # country
        if friendly_country:
            id_country = get_or_create_fk(cursor,
                'COUNTRIES', 'country_name', row['country_name'].strip())
        else:
            id_country = safe_int(row.get('id_country'))

        # company
        if friendly_company:
            id_company = get_or_create_fk(cursor,
                'COMPANIES', 'company_name', row['company_name'].strip())
        else:
            id_company = safe_int(row.get('id_company'))

        # department
        if friendly_department:
            id_department = get_or_create_fk(cursor,
                'DEPARTMENTS', 'department_name', row['department_name'].strip())
        else:
            id_department = safe_int(row.get('id_department'))

        # --- id_manager ---
        if raw_id_entity and pd.notnull(row.get('id_manager')):
            # raw mode, id_manager numeric
            id_manager = safe_int(row['id_manager'])
        elif friendly_mgr_email:
            id_manager = get_employee_id(cursor, row['email_manager'])
        else:
            id_manager = safe_int(row.get('id_manager'))

        # --- id_company_entity (RAW mode) ---
        id_company_entity = safe_int(row.get('id_company_entity'))

        # --- Pregătește INSERT/UPSERT ---
        cols = []
        vals = []

        if raw_id_entity and id_company_entity is not None:
            cols.append('id_company_entity')
            vals.append(id_company_entity)

        # name (friendly mode trebuie obligatoriu)
        if friendly_entity:
            cols.append('company_entity_name')
            vals.append(row['company_entity_name'].strip())
        else:
            # în raw mode fără name nu putem continua
            raise ValueError(f"Lipsește company_entity_name la rândul {i}")

        # restul FK-urilor
        cols += ['id_region','id_country','id_company','id_department','id_manager']
        vals += [id_region, id_country, id_company, id_department, id_manager]

        # construiește ON DUPLICATE KEY UPDATE
        ondup = [
            'company_entity_name=VALUES(company_entity_name)',
            'id_region=VALUES(id_region)',
            'id_country=VALUES(id_country)',
            'id_company=VALUES(id_company)',
            'id_department=VALUES(id_department)',
            'id_manager=VALUES(id_manager)',
        ]
        # dacă avem PK raw, menținem id_company_entity în LAST_INSERT_ID
        ondup.append('id_company_entity=LAST_INSERT_ID(id_company_entity)')

        sql = f"""
            INSERT INTO company_entities ({', '.join(cols)})
            VALUES ({', '.join(['%s']*len(vals))})
            ON DUPLICATE KEY UPDATE {', '.join(ondup)}
        """

        # --- Execuție ---
        cursor.execute(sql, tuple(vals))
        count += 1

    return count
