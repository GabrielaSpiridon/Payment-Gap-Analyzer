import pandas as pd
from datetime import date


def insert_salary_history(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela SALARY_HISTORY din dataframe-ul df.
    Suportă două moduri:
      - raw: coloana 'id_employee' (și opțional 'id_salary_history') prezentă
      - user-friendly: coloanele 'email' sau 'employee_email' prezente pentru lookup
    Returnează numărul de rânduri procesate.
    """
    # Normalizează header-ele: strip, lowercase, whitespace -> underscore
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # Redenumește 'email' -> 'employee_email' dacă e cazul
    if 'email' in df.columns and 'employee_email' not in df.columns:
        df.rename(columns={'email': 'employee_email'}, inplace=True)
    # Redenumește 'employee' -> 'employee_email' dacă e cazul
    if 'employee' in df.columns and 'employee_email' not in df.columns:
        df.rename(columns={'employee': 'employee_email'}, inplace=True)

    # Convertește datele la tip date și normalizează
    def to_date(val):
        if pd.isnull(val):
            return None
        if isinstance(val, pd.Timestamp):
            return val.to_pydatetime().date()
        if isinstance(val, date):
            return val
        return pd.to_datetime(val).date()

    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    count = 0
    for _, row in df.iterrows():
        # Determină id_employee raw vs user-friendly
        if 'employee_email' in df.columns:
            # user-friendly: lookup pe email
            cursor.execute(
                "SELECT id_employee FROM employees WHERE email = %s",
                (row['employee_email'],)
            )
            res = cursor.fetchone()
            if not res:
                raise ValueError(f"Employee with email {row['employee_email']} not found.")
            id_employee = res[0]
        else:
            # raw mode
            id_employee = safe_int(row['id_employee'])

        # Parse id_salary_history pentru upsert
        id_salary_history = safe_int(row.get('id_salary_history')) if 'id_salary_history' in df.columns else None

        salary     = float(row['salary'])
        start_date = to_date(row['start_date'])
        end_date   = to_date(row['end_date'])

        if id_salary_history is not None:
            # upsert: inserează sau actualizează după PK
            cursor.execute(
                """
                INSERT INTO salary_history (
                    id_salary_history, id_employee, salary, start_date, end_date
                ) VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    salary     = VALUES(salary),
                    start_date = VALUES(start_date),
                    end_date   = VALUES(end_date)
                """,
                (id_salary_history, id_employee, salary, start_date, end_date)
            )
        else:
            # insert simplu
            cursor.execute(
                """
                INSERT INTO salary_history (
                    id_employee, salary, start_date, end_date
                ) VALUES (%s, %s, %s, %s)
                 ON DUPLICATE KEY UPDATE
                    salary   = VALUES(salary),
                    end_date = VALUES(end_date)
                """,
                (id_employee, salary, start_date, end_date)
            )
        count += 1

    return count
