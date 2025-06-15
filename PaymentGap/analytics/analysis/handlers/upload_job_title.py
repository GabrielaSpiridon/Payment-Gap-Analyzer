import pandas as pd

def insert_job_title(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    def safe_float(val):
        return float(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        id_job_title = safe_int(row['id_job_title']) if 'id_job_title' in df.columns else None
        id_department = safe_int(row['id_department'])
        min_salary = safe_float(row['min_salary'])
        max_salary = safe_float(row['max_salary'])

        if id_job_title is not None:
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
                id_job_title,
                row['job_title'],
                id_department,
                min_salary,
                max_salary
            ))
        else:
            cursor.execute("""
                INSERT INTO job_title (
                    job_title, id_department, min_salary, max_salary
                ) VALUES (%s, %s, %s, %s)
            """, (
                row['job_title'],
                id_department,
                min_salary,
                max_salary
            ))
    return len(df)
