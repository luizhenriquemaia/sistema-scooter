# Generated by Django 3.0.4 on 2020-06-17 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0026_auto_20200614_0129'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scooter',
            name='chassisNumber',
            field=models.CharField(max_length=200),
        ),
    ]
