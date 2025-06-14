import pandas as pd

def insert_salary_history(df, cursor):
    for _, row in df.iterrows():
        start_date = row['start_date']
        if isinstance(start_date, pd.Timestamp):
            start_date = start_date.to_pydatetime().date()

        end_date = row['end_date']
        if pd.notnull(end_date) and isinstance(end_date, pd.Timestamp):
            end_date = end_date.to_pydatetime().date()
        else:
            end_date = None

        cursor.execute("""
            INSERT INTO salary_history (
                id_salary_history, id_employee, salary, start_date, end_date
            ) VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE salary = VALUES(salary)
        """, (
            int(row['id_salary_history']),
            int(row['id_employee']),
            float(row['salary']),
            start_date,
            end_date
        ))
    return len(df)
