# Generated by Django 3.0.4 on 2020-06-05 02:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0012_movement_destinyscooter'),
    ]

    operations = [
        migrations.AddField(
            model_name='movement',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='movement', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
