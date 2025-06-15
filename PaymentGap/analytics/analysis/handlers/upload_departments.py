import pandas as pd

def insert_departments(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO departments (
                id_department, id_company, department_name
            ) VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                id_company = VALUES(id_company),
                department_name = VALUES(department_name)
        """, (
            safe_int(row['id_department']),
            safe_int(row['id_company']),
            row['department_name']
        ))
    return len(df)
