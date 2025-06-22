from django.db import models

class Country(models.Model):
    id_country = models.AutoField(primary_key=True)
    id_region = models.ForeignKey('Region', models.DO_NOTHING, db_column='id_region', blank=True, null=True)
    country_name = models.CharField(max_length=40, blank=True, null=True)

    def __str__(self):
        return self.country_name if self.country_name else "No Country Name"
    
    class Meta:
        db_table = 'countries'