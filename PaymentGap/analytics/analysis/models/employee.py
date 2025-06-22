from django.db import models

class Employee(models.Model):
    id_employee = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=20)
    second_name = models.CharField(max_length=25)
    email = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    employment_date = models.DateField(blank=True, null=True)
    id_job_title = models.ForeignKey('JobTitle', models.DO_NOTHING, db_column='id_job_title', blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    national_id = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    nationality = models.CharField(max_length=20, blank=True, null=True)
    id_line_manager = models.ForeignKey('self', models.DO_NOTHING, db_column='id_line_manager', blank=True, null=True)
    id_compensation_manager = models.ForeignKey('self', models.DO_NOTHING, db_column='id_compensation_manager', related_name='employees_id_compensation_manager_set', blank=True, null=True)
    id_department = models.ForeignKey('CompanyEntity', models.DO_NOTHING, db_column='id_department', blank=True, null=True)


    def __str__(self):
        return f"{self.first_name} {self.second_name}"

    class Meta:
        db_table = 'employees'

