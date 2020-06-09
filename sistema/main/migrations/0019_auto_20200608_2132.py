# Generated by Django 3.0.4 on 2020-06-09 00:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0018_auto_20200608_2118'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movement',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='movement', to=settings.AUTH_USER_MODEL),
        ),
    ]