from django.db import models
from datetime import date


class StatusScooter(models.Model):
    description = models.CharField(max_length=200)


class Report(models.Model):
    dateReport = models.DateField(default=date(2000, 1, 1))
    objects = models.Manager()


class Movement(models.Model):
    chassisNumber = models.IntegerField()
    OL = models.CharField(max_length=50, null=True)
    deliveryman = models.CharField(max_length=200)
    observation = models.CharField(max_length=500)
    pickUpTime = models.TimeField()
    returnTime = models.TimeField()
    status = models.ForeignKey(StatusScooter, on_delete=models.CASCADE)
    helmet = models.BooleanField()
    bags = models.BooleanField()
    charger = models.BooleanField()
    case = models.BooleanField()
    objects = models.Manager()