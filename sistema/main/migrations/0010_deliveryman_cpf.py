# Generated by Django 3.0.4 on 2020-06-01 03:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20200531_2118'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliveryman',
            name='cpf',
            field=models.CharField(default=0, max_length=11),
        ),
    ]
