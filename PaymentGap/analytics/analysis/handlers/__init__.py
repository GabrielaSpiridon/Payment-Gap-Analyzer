from .upload_employees import insert_employees
from .upload_salary_history import insert_salary_history
from .upload_job_title import insert_job_title
from .upload_companies import insert_companies
from .upload_departments import insert_departments
from .upload_countries import insert_countries
from .upload_locations import insert_locations
from .upload_regions import insert_regions

handler_map = {
    'employees': insert_employees,
    'salary_history': insert_salary_history,
    'job_title': insert_job_title,
    'companies': insert_companies,
    'departments': insert_departments,
    'countries': insert_countries,
    'locations': insert_locations,
    'regions': insert_regions
}
