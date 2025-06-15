import pandas as pd

def insert_locations(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO locations (
                id_location, id_country, city_name
            ) VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
                id_country = VALUES(id_country),
                city_name = VALUES(city_name)
        """, (
            safe_int(row['id_location']),
            safe_int(row['id_country']),
            row['city_name']
        ))
    return len(df)
