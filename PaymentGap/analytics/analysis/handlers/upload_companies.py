import pandas as pd

def insert_companies(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO companies (
                id_company, company_name
            ) VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE
                company_name = VALUES(company_name)
        """, (
            safe_int(row['id_company']),
            row['company_name']
        ))
    return len(df)
