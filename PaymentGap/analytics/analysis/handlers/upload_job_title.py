import pandas as pd

def insert_job_title(df, cursor):
    for _, row in df.iterrows():
        if 'id_job_title' in df.columns:
            cursor.execute("""
                INSERT INTO job_title (
                    id_job_title, job_title, id_department, min_salary, max_salary
                ) VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    job_title = VALUES(job_title),
                    id_department = VALUES(id_department),
                    min_salary = VALUES(min_salary),
                    max_salary = VALUES(max_salary)
            """, (
                int(row['id_job_title']),
                row['job_title'],
                int(row['id_department']) if not pd.isna(row['id_department']) else None,
                float(row['min_salary']) if not pd.isna(row['min_salary']) else None,
                float(row['max_salary']) if not pd.isna(row['max_salary']) else None
            ))
        else:
            cursor.execute("""
                INSERT INTO job_title (
                    job_title, id_department, min_salary, max_salary
                ) VALUES (%s, %s, %s, %s)
            """, (
                row['job_title'],
                int(row['id_department']) if not pd.isna(row['id_department']) else None,
                float(row['min_salary']) if not pd.isna(row['min_salary']) else None,
                float(row['max_salary']) if not pd.isna(row['max_salary']) else None
            ))
    return len(df)
