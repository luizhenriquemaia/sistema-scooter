from django.db import models
from datetime import date


class StatusScooter(models.Model):
    description = models.CharField(max_length=200)
    objects = models.Manager()


class Scooter(models.Model):
    chassisNumber = models.IntegerField()
    objects = models.Manager()


class Report(models.Model):
    dateReport = models.DateField(default=date(2000, 1, 1))
    objects = models.Manager()


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
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