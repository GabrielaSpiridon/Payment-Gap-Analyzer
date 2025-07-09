import pandas as pd
from datetime import date
from .db_utils import get_or_create_fk

def insert_employees(df: pd.DataFrame, cursor) -> int:
    """
    Inserează/actualizează tabela EMPLOYEES din dataframe-ul df.
    Friendly mode (după email ➔ UNIQUE(email)) și
    Raw mode (după id_employee ➔ PRIMARY KEY).
    Returnează numărul de rânduri procesate.
    """
    # 1) Normalizează header-ele
    df.columns = (
        df.columns
          .str.strip()
          .str.lower()
          .str.replace(r'\s+', '_', regex=True)
    )
    # 2) Redenumește coloane prietenoase
    if 'email' in df.columns and 'employee_email' not in df.columns:
        df.rename(columns={'email': 'employee_email'}, inplace=True)
    if 'department' in df.columns and 'department_name' not in df.columns:
        df.rename(columns={'department': 'department_name'}, inplace=True)
    if 'job_title' in df.columns and 'job_title_name' not in df.columns:
        df.rename(columns={'job_title': 'job_title_name'}, inplace=True)
    if 'line_manager' in df.columns and 'line_manager_email' not in df.columns:
        df.rename(columns={'line_manager': 'line_manager_email'}, inplace=True)
    if 'compensation_manager' in df.columns and 'compensation_manager_email' not in df.columns:
        df.rename(columns={'compensation_manager': 'compensation_manager_email'}, inplace=True)

    # 3) Detect friendly vs raw
    friendly_emp    = 'employee_email' in df.columns
    friendly_dept   = 'department_name' in df.columns
    friendly_jtitle = 'job_title_name' in df.columns
    friendly_lmgr   = 'line_manager_email' in df.columns
    friendly_cmgr   = 'compensation_manager_email' in df.columns

    # 4) Converters
    def safe_int(v):   return int(v) if pd.notnull(v) else None
    def safe_float(v): return float(v) if pd.notnull(v) else None
    def to_date(v):
        if pd.isnull(v): return None
        if isinstance(v, pd.Timestamp): return v.to_pydatetime().date()
        if isinstance(v, date): return v
        return pd.to_datetime(v).date()

    count = 0
    for _, row in df.iterrows():
        # --- lookups for FKs ---
        # department
        if friendly_dept:
            id_department = get_or_create_fk(cursor,
                'DEPARTMENTS','department_name', row['department_name'].strip())
        else:
            id_department = safe_int(row.get('id_department'))

        # job title
        if friendly_jtitle:
            id_job_title = get_or_create_fk(cursor,
                'JOB_TITLE','job_title', row['job_title_name'].strip(),
                extra_cols=['id_department'], extra_vals=[id_department])
        else:
            id_job_title = safe_int(row.get('id_job_title'))

        # line manager
        if friendly_lmgr:
            cursor.execute("SELECT id_employee FROM employees WHERE email=%s",
                           (row['line_manager_email'],))
            res = cursor.fetchone()
            id_line_manager = res[0] if res else None
        else:
            id_line_manager = safe_int(row.get('id_line_manager'))

        # compensation manager
        if friendly_cmgr:
            cursor.execute("SELECT id_employee FROM employees WHERE email=%s",
                           (row['compensation_manager_email'],))
            res = cursor.fetchone()
            id_compensation_manager = res[0] if res else None
        else:
            id_compensation_manager = safe_int(row.get('id_compensation_manager'))

        # --- basic fields ---
        first_name   = row['first_name']
        second_name  = row['second_name']
        email        = row.get('employee_email')
        phone        = row.get('phone')
        employment_date = to_date(row.get('employment_date'))
        salary       = safe_float(row.get('salary'))
        gender       = row.get('gender')
        national_id  = row.get('national_id')
        date_of_birth= to_date(row.get('date_of_birth'))
        nationality  = row.get('nationality')

        # --- UPSERT via UNIQUE(email) or PRIMARY KEY(id_employee) ---
        if friendly_emp:
            # omit id_employee, bazează-te pe UNIQUE(email)
            cursor.execute("""
                INSERT INTO employees (
                  first_name, second_name, email, phone,
                  employment_date, id_job_title, salary, gender,
                  national_id, date_of_birth, nationality,
                  id_line_manager, id_compensation_manager, id_department
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE
                  first_name   = VALUES(first_name),
                  second_name  = VALUES(second_name),
                  phone        = VALUES(phone),
                  employment_date       = VALUES(employment_date),
                  id_job_title = VALUES(id_job_title),
                  salary       = VALUES(salary),
                  gender       = VALUES(gender),
                  national_id  = VALUES(national_id),
                  date_of_birth= VALUES(date_of_birth),
                  nationality  = VALUES(nationality),
                  id_line_manager        = VALUES(id_line_manager),
                  id_compensation_manager= VALUES(id_compensation_manager),
                  id_department          = VALUES(id_department)
            """, (
                first_name, second_name, email, phone,
                employment_date, id_job_title, salary, gender,
                national_id, date_of_birth, nationality,
                id_line_manager, id_compensation_manager, id_department
            ))
        else:
            # include explicit id_employee pentru RAW MODE
            id_employee = safe_int(row.get('id_employee'))
            if id_employee is not None:
                cursor.execute("""
                    INSERT INTO employees (
                      id_employee, first_name, second_name, email, phone,
                      employment_date, id_job_title, salary, gender,
                      national_id, date_of_birth, nationality,
                      id_line_manager, id_compensation_manager, id_department
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    ON DUPLICATE KEY UPDATE
                      first_name   = VALUES(first_name),
                      second_name  = VALUES(second_name),
                      email        = VALUES(email),
                      phone        = VALUES(phone),
                      employment_date       = VALUES(employment_date),
                      id_job_title = VALUES(id_job_title),
                      salary       = VALUES(salary),
                      gender       = VALUES(gender),
                      national_id  = VALUES(national_id),
                      date_of_birth= VALUES(date_of_birth),
                      nationality  = VALUES(nationality),
                      id_line_manager        = VALUES(id_line_manager),
                      id_compensation_manager= VALUES(id_compensation_manager),
                      id_department          = VALUES(id_department)
                """, (
                    id_employee, first_name, second_name, email, phone,
                    employment_date, id_job_title, salary, gender,
                    national_id, date_of_birth, nationality,
                    id_line_manager, id_compensation_manager, id_department
                ))
            else:
                # fallback identical insert (va folosi UNIQUE(email))
                cursor.execute("""
                    INSERT INTO employees (
                      first_name, second_name, email, phone,
                      employment_date, id_job_title, salary, gender,
                      national_id, date_of_birth, nationality,
                      id_line_manager, id_compensation_manager, id_department
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    ON DUPLICATE KEY UPDATE
                      first_name   = VALUES(first_name),
                      second_name  = VALUES(second_name),
                      phone        = VALUES(phone),
                      employment_date       = VALUES(employment_date),
                      id_job_title = VALUES(id_job_title),
                      salary       = VALUES(salary),
                      gender       = VALUES(gender),
                      national_id  = VALUES(national_id),
                      date_of_birth= VALUES(date_of_birth),
                      nationality  = VALUES(nationality),
                      id_line_manager        = VALUES(id_line_manager),
                      id_compensation_manager= VALUES(id_compensation_manager),
                      id_department          = VALUES(id_department)
                """, (
                    first_name, second_name, email, phone,
                    employment_date, id_job_title, salary, gender,
                    national_id, date_of_birth, nationality,
                    id_line_manager, id_compensation_manager, id_department
                ))
        count += 1

    return count
