# Generated by Django 3.0.6 on 2020-05-30 18:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_auto_20200530_1536'),
    ]

    operations = [
        migrations.AddField(
            model_name='movement',
            name='OL',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
