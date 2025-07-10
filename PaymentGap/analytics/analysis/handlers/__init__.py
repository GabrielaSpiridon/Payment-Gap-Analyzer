import pandas as pd
from .upload_employees import insert_employees
from .upload_salary_history import insert_salary_history
from .upload_job_title import insert_job_title
from .upload_companies import insert_companies
from .upload_departments import insert_departments
from .upload_countries import insert_countries
from .upload_locations import insert_locations
from .upload_regions import insert_regions


handler_map = {
    'employee': insert_employees,
    'employees': insert_employees,
    'salary_history': insert_salary_history,
    'salary_histories': insert_salary_history,
    'job_title': insert_job_title,
    'job_titles': insert_job_title,
    'company': insert_companies,
    'companies': insert_companies,
    'department': insert_departments,
    'departments': insert_departments,
    'country': insert_countries,
    'countries': insert_countries,
    'location': insert_locations,
    'locations': insert_locations,
    'region': insert_regions,
    'regions': insert_regions,
}

