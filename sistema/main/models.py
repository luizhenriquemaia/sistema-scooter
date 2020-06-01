from django.db import models
from datetime import datetime, date


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
    active = models.BooleanField(default=True)


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    deliveryman = models.ForeignKey(Deliveryman, on_delete=models.CASCADE, null=True)
    logisticOperator = models.ForeignKey(LogisticOperator, on_delete=models.CASCADE, null=True)
    dateMovement = models.DateField(default=date(2000, 1, 1))
    pickUpTime = models.TimeField(null=True)
    returnTime = models.TimeField(null=True)
    accessoriesHelmet = models.BooleanField(default=False)
    accessoriesBag = models.BooleanField(default=False)
    accessoriesCase = models.BooleanField(default=False)
    accessoriesCharger = models.BooleanField(default=False)
    observation = models.CharField(max_length=500, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        new_movement = Movement(
            scooter=Scooter.objects.filter(
                chassisNumber=int(validated_data['scooter']))[0],
            deliveryman=Deliveryman.objects.filter(
                deliveryman=validated_data['name'])[0],
            logisticOperator=LogisticOperator.objects.filter(
                description=validated_data['OL'])[0],
            dateMovement=date.today(),
            pickUpTime = datetime.now().time(),
            accessoriesHelmet=validated_data['accessoriesHelmet'],
            accessoriesBag=validated_data['accessoriesBag'],
            accessoriesCase=validated_data['acessoriesCharger'],
            accessoriesCharger=validated_data['acessoriesCase'],
            observation=validated_data['oservation']
        )

