# Generated by Django 3.0.4 on 2020-06-13 17:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0022_auto_20200613_1411'),
    ]

    operations = [
        migrations.CreateModel(
            name='TypePeople',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='peopleregistration',
            name='typePeople',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.TypePeople'),
        ),
    ]
