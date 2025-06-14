from django.contrib import admin
from django.urls import path
from analysis.views.views import upload_excel

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload-excel/', upload_excel),
]
