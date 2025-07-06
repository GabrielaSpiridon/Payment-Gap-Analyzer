import pandas as pd
from .db_utils import get_or_create_fk

def insert_departments(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela DEPARTMENTS din dataframe-ul df.
    Suportă două moduri:
      - raw: coloanele 'id_department' și 'id_company' prezente
      - user-friendly: coloanele 'company'/'company_name' și 'department_name' prezente
    Evită duplicatele prin SELECT+UPDATE/INSERT în friendly mode,
    și ON DUPLICATE KEY UPDATE în raw mode.
    Returnează numărul de rânduri procesate.
    """
    # Normalizează header-ele: trim, lowercase, spații -> underscore
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # Redenumește pentru user-friendly
    if 'company' in df.columns and 'company_name' not in df.columns:
        df.rename(columns={'company': 'company_name'}, inplace=True)
    # 'department' poate fi deja 'department_name'
    if 'department' in df.columns and 'department_name' not in df.columns:
        df.rename(columns={'department': 'department_name'}, inplace=True)

    # Normalizează valorile text
    df['department_name'] = df['department_name'].astype(str).str.strip()
    if 'company_name' in df.columns:
        df['company_name'] = df['company_name'].astype(str).str.strip()

    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    # determină modul de import
    friendly_mode = 'company_name' in df.columns

    count = 0
    for _, row in df.iterrows():
        if friendly_mode:
            # user-friendly: company lookup
            id_company = get_or_create_fk(
                cursor,
                table='COMPANIES',
                lookup_col='company_name',
                lookup_val=row['company_name']
            )
            # ignore id_department from Excel
            id_department = None
        else:
            # raw mode
            id_company = safe_int(row['id_company'])
            id_department = safe_int(row['id_department']) if 'id_department' in df.columns else None

        dept_name = row['department_name']

        if id_department is not None:
            # RAW MODE: upsert by PK
            cursor.execute(
                """
                INSERT INTO departments (
                    id_department, id_company, department_name
                ) VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    id_company      = VALUES(id_company),
                    department_name = VALUES(department_name)
                """,
                (id_department, id_company, dept_name)
            )
        else:
            # FRIENDLY MODE: avoid duplicates
            cursor.execute(
                "SELECT id_department FROM departments WHERE department_name = %s AND id_company = %s",
                (dept_name, id_company)
            )
            existing = cursor.fetchone()
            if existing:
                # update if needed
                cursor.execute(
                    """
                    UPDATE departments
                       SET id_company = %s, department_name = %s
                     WHERE id_department = %s
                    """,
                    (id_company, dept_name, existing[0])
                )
            else:
                # insert new
                cursor.execute(
                    "INSERT INTO departments (id_company, department_name) VALUES (%s, %s)",
                    (id_company, dept_name)
                )

        count += 1

    return count
