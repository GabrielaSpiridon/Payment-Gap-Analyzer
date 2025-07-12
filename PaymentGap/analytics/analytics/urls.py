from django.contrib import admin
from django.urls import path
from analysis.views.views import upload_excel
from analysis.views.dashboard import gender_distribution_api
from analysis.views.dashboard import salary_gender_department_api
from analysis.views.dashboard import salary_by_year_api
from analysis.views.dashboard import salary_gender_seniority_api
from analysis.views.dashboard import age_distribution_api
from analysis.views.dashboard import salary_by_month_api
from analysis.views.dashboard import workforce_composition_api
from analysis.views.dashboard import salary_by_gender_job_title_api
from analysis.views.dashboard import heatmap_data_api
from analysis.statistic.gender_pay_gap_trends import gender_pay_gap_trends

from analysis.views.report_views import company_details_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload-excel/', upload_excel),
    path('api/gender-distribution/', gender_distribution_api),
    path('api/salary-gender-department/', salary_gender_department_api),
    path('api/salary-by-year/', salary_by_year_api),
    path('api/salary-gender-seniority/', salary_gender_seniority_api),
    path('api/age-distribution/', age_distribution_api),
    path('api/salary-by-month/', salary_by_month_api),
    path('api/workforce-composition/', workforce_composition_api),
    path('api/salary-by-gender-job-title/', salary_by_gender_job_title_api),
    path('api/salary-heatmap/', heatmap_data_api),
    path('api/gender-pay-gap-trends/', gender_pay_gap_trends),

    path('api/company-details/', company_details_api),
]
