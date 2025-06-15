import pandas as pd

def insert_employees(df, cursor):
    for _, row in df.iterrows():
        def safe_int(val):
            return int(val) if pd.notnull(val) else None

        def safe_float(val):
            return float(val) if pd.notnull(val) else None

        def safe_date(val):
            if pd.notnull(val):
                if isinstance(val, pd.Timestamp):
                    return val.to_pydatetime().date()
                return val  
            return None

        id_employee = safe_int(row['id_employee'])

        values = (
            row['first_name'],
            row['second_name'],
            row['email'],
            row['phone'],
            safe_date(row['employment_date']),
            safe_int(row['id_job_title']),
            safe_float(row['salary']),
            row['gender'],
            row['national_id'],
            safe_date(row['date_of_birth']),
            row['nationality'],
            safe_int(row['id_line_manager']),
            safe_int(row['id_compensation_manager']),
            safe_int(row['id_department'])
        )

        if id_employee is not None:
            cursor.execute("""
                INSERT INTO employees (
                    id_employee, first_name, second_name, email, phone,
                    employment_date, id_job_title, salary, gender, national_id,
                    date_of_birth, nationality, id_line_manager,
                    id_compensation_manager, id_department
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE salary = VALUES(salary)
            """, (id_employee, *values))
        else:
            cursor.execute("""
                INSERT INTO employees (
                    first_name, second_name, email, phone,
                    employment_date, id_job_title, salary, gender, national_id,
                    date_of_birth, nationality, id_line_manager,
                    id_compensation_manager, id_department
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, values)

    return len(df)
