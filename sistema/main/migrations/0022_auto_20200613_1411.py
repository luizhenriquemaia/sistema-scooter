# Generated by Django 3.0.4 on 2020-06-13 17:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0021_auto_20200612_1646'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Deliveryman',
            new_name='PeopleRegistration',
        ),
        migrations.RenameField(
            model_name='movement',
            old_name='deliveryman',
            new_name='peopleRegistration',
        ),
    ]
