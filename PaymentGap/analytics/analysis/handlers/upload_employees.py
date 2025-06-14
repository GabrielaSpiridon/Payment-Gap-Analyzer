import pandas as pd

def insert_employees(df, cursor):
    for _, row in df.iterrows():
        id_employee = int(row['id_employee']) if 'id_employee' in df.columns and pd.notnull(row['id_employee']) else None

        values = (
            row['first_name'],
            row['second_name'],
            row['email'],
            row['phone'],
            row['employment_date'],
            int(row['id_job_title']),
            float(row['salary']),
            row['gender'],
            row['national_id'],
            row['date_of_birth'],
            row['nationality'],
            int(row['id_line_manager']),
            int(row['id_compensation_manager']),
            int(row['id_department'])
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
