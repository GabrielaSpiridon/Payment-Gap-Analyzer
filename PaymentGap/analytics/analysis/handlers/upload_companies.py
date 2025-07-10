import pandas as pd

def insert_companies(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela COMPANIES din dataframe-ul df.
    Suportă două moduri:
      - raw mode: folosește coloana 'id_company' din Excel
      - friendly mode: folosește doar 'company' sau 'company_name',
        ignorând id_company și evitând duplicatele după UNIQUE(company_name)
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # 2) Redenumește 'company' -> 'company_name' dacă e cazul
    if 'company' in df.columns and 'company_name' not in df.columns:
        df.rename(columns={'company': 'company_name'}, inplace=True)

    # 3) Detectează modul de import
    friendly = 'company_name' in df.columns

    def safe_int(v):
        return int(v) if pd.notnull(v) else None

    count = 0
    for _, row in df.iterrows():
        if friendly:
            # USER-FRIENDLY: ignor id_company, upsert pe UNIQUE(company_name)
            name = row['company_name'].strip()
            cursor.execute("""
                INSERT INTO companies (company_name)
                VALUES (%s)
                ON DUPLICATE KEY UPDATE
                  company_name = VALUES(company_name)
            """, (name,))
        else:
            # RAW MODE: folosește id_company + upsert pe PK
            id_company = safe_int(row.get('id_company'))
            name = row['company_name'].strip() if 'company_name' in row else row['company_name']
            cursor.execute("""
                INSERT INTO companies (id_company, company_name)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE
                  company_name = VALUES(company_name)
            """, (id_company, name))

        count += 1

    return count