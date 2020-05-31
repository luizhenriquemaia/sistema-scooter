# Generated by Django 3.0.4 on 2020-05-31 22:12

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_auto_20200531_1518'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Report',
        ),
        migrations.AddField(
            model_name='movement',
            name='dateMovement',
            field=models.DateField(default=datetime.date(2000, 1, 1)),
        ),
        migrations.AlterField(
            model_name='movement',
            name='observation',
            field=models.CharField(max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='movement',
            name='pickUpTime',
            field=models.TimeField(null=True),
        ),
        migrations.AlterField(
            model_name='movement',
            name='returnTime',
            field=models.TimeField(null=True),
        ),
    ]
