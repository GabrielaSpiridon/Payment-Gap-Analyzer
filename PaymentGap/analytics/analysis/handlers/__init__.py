from .upload_employees import insert_employees
from .upload_salary_history import insert_salary_history
from .upload_job_title import insert_job_title

handler_map = {
    'employees': insert_employees,
    'salary_history': insert_salary_history,
    'job_title': insert_job_title,
}
