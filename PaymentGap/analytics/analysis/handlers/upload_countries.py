import pandas as pd

def insert_countries(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO countries (
                id_country, id_region, country_name
            ) VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                id_region = VALUES(id_region),
                country_name = VALUES(country_name)
        """, (
            safe_int(row['id_country']),
            safe_int(row['id_region']),
            row['country_name']
        ))
    return len(df)
