# Generated by Django 3.0.4 on 2020-06-04 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0011_auto_20200601_0059'),
    ]

    operations = [
        migrations.AddField(
            model_name='movement',
            name='destinyScooter',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
