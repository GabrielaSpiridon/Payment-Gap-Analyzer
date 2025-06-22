from django.db import models

class Department(models.Model):
    id_department = models.AutoField(primary_key=True)
    id_company = models.ForeignKey('Company', models.DO_NOTHING, db_column='id_company', blank=True, null=True)
    department_name = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.department_name if self.department_name else "No Department Name"
    
    class Meta:
        db_table = 'departments'

