# Generated by Django 3.0.4 on 2020-06-12 19:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0020_auto_20200612_1513'),
    ]

    operations = [
        migrations.CreateModel(
            name='TypeMovement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='movement',
            name='typeMovement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='main.TypeMovement'),
        ),
    ]