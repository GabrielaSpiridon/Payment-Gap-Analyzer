import pandas as pd
from .db_utils import get_or_create_fk

def insert_job_title(df: pd.DataFrame, cursor) -> int:
    # normalize columns…
    df.columns = (df.columns
        .str.strip().str.lower()
        .str.replace(r'\s+', '_', regex=True)
    )
    if 'department' in df.columns and 'department_name' not in df.columns:
        df.rename(columns={'department':'department_name'}, inplace=True)

    def safe_int(x):   return int(x) if pd.notnull(x) else None
    def safe_float(x): return float(x) if pd.notnull(x) else None

    count = 0
    for _, row in df.iterrows():
        # 1) upsert by PK, dacă id_job_title e prezent
        id_job_title = safe_int(row.get('id_job_title')) if 'id_job_title' in df.columns else None

        # 2) determină id_department
        if 'department_name' in df.columns:
            id_dept = get_or_create_fk(cursor, 'DEPARTMENTS', 'department_name', row['department_name'])
        else:
            id_dept = safe_int(row['id_department'])

        title = row['job_title']
        min_sal = safe_float(row['min_salary'])
        max_sal = safe_float(row['max_salary'])

        if id_job_title is not None:
            # upsert după PK
            cursor.execute("""
                INSERT INTO job_title
                 (id_job_title, job_title, id_department, min_salary, max_salary)
                VALUES (%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                  job_title     = VALUES(job_title),
                  id_department = VALUES(id_department),
                  min_salary    = VALUES(min_salary),
                  max_salary    = VALUES(max_salary)
            """, (id_job_title, title, id_dept, min_sal, max_sal))

        else:
            # friendly mode: verificăm existența înainte
            cursor.execute(
                "SELECT id_job_title FROM job_title "
                "WHERE job_title=%s AND id_department=%s",
                (title, id_dept)
            )
            existing = cursor.fetchone()
            if existing:
                # doar actualizăm salariile
                eid = existing[0]
                cursor.execute("""
                    UPDATE job_title
                       SET min_salary=%s, max_salary=%s
                     WHERE id_job_title=%s
                """, (min_sal, max_sal, eid))
            else:
                # inserare nouă
                cursor.execute("""
                    INSERT INTO job_title
                     (job_title, id_department, min_salary, max_salary)
                    VALUES (%s,%s,%s,%s)
                """, (title, id_dept, min_sal, max_sal))

        count += 1

    return count
