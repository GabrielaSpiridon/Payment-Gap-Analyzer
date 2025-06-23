from django.contrib import admin
from django.urls import path
from analysis.views.views import upload_excel
from analysis.views.dashboard import gender_distribution_api
from analysis.views.dashboard import salary_gender_department_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload-excel/', upload_excel),
    path('api/gender-distribution/', gender_distribution_api),
    path('api/salary-gender-department/', salary_gender_department_api),

]
