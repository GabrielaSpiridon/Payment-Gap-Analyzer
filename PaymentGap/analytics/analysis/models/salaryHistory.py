from django.db import models

class SalaryHistory(models.Model):
    id_salary_history = models.AutoField(primary_key=True)
    id_employee = models.ForeignKey('Employee', models.DO_NOTHING, db_column='id_employee', blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Salary History for {self.id_employee.first_name} {self.id_employee.second_name} from {self.start_date} to {self.end_date}"

    class Meta:
        db_table = 'salary_history'