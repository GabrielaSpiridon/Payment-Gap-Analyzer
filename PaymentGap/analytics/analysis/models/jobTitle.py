from django.db import models

class JobTitle(models.Model):
    id_job_title = models.AutoField(primary_key=True)
    job_title = models.CharField(max_length=30, blank=True, null=True)
    id_department = models.ForeignKey('CompanyEntity', models.DO_NOTHING, db_column='id_department', blank=True, null=True)
    min_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.job_title if self.job_title else "No Job Title"
   
    class Meta:
        db_table = 'job_title'
