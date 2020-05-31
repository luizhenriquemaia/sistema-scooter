from django.db import models
from datetime import date


class StatusScooter(models.Model):
    description = models.CharField(max_length=200)
    objects = models.Manager()


class LogisticOperator(models.Model):
    description = models.CharField(max_length=200)


class Scooter(models.Model):
    chassisNumber = models.IntegerField()
    status = models.ForeignKey(StatusScooter, on_delete=models.CASCADE, default=0)
    objects = models.Manager()


class Deliveryman(models.Model):
    name = models.CharField(max_length=400)
    LogisticOperator = models.ForeignKey(LogisticOperator, on_delete=models.CASCADE, null=True)
    active = models.BooleanField(default=True)


class Report(models.Model):
    dateReport = models.DateField(default=date(2000, 1, 1))
    objects = models.Manager()


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    deliveryman = models.ForeignKey(Deliveryman, on_delete=models.CASCADE, null=True)
    observation = models.CharField(max_length=500)
    pickUpTime = models.TimeField()
    returnTime = models.TimeField()
    helmet = models.BooleanField()
    bags = models.BooleanField()
    charger = models.BooleanField()
    case = models.BooleanField()
    objects = models.Manager()
