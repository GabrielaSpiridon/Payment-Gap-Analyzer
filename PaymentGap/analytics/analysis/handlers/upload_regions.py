import pandas as pd

def insert_regions(df, cursor):
    def safe_int(val):
        return int(val) if pd.notnull(val) else None

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT INTO regions (
                id_region, region_name
            ) VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE
                region_name = VALUES(region_name)
        """, (
            safe_int(row['id_region']),
            row['region_name']
        ))
    return len(df)
