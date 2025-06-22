from django.db import models

class Company(models.Model):
    id_company = models.AutoField(primary_key=True)
    company_name = models.CharField(max_length=25, blank=True, null=True)


    def __str__(self):
        return self.company_name if self.company_name else "No Company Name"    
    
    class Meta:
        db_table = 'companies'
