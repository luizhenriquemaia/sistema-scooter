# Generated by Django 3.0.4 on 2020-06-09 00:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_auto_20200608_2111'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movement',
            name='logisticOperatorDescription',
        ),
        migrations.AddField(
            model_name='movement',
            name='logisticOperator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.LogisticOperator'),
        ),
    ]
