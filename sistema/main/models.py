from django.db import models
from datetime import datetime, date


class StatusScooter(models.Model):
    description = models.CharField(max_length=200)
    objects = models.Manager()

    def create(self, **validated_data):
        new_status = StatusScooter(
            description=validated_data['description']
        )
        new_status.save()
        return new_status


class LogisticOperator(models.Model):
    description = models.CharField(max_length=200, unique=True)
    objects = models.Manager()

    def create(self, **validated_data):
        new_logistic_operator = LogisticOperator(
            description=validated_data['description']
        )
        new_logistic_operator.save()
        return new_logistic_operator
 

class Scooter(models.Model):
    chassisNumber = models.IntegerField(unique=True)
    status = models.ForeignKey(StatusScooter, on_delete=models.CASCADE, default=0)
    objects = models.Manager()

    def create(self, **validated_data):
        new_scooter = Scooter(
            chassisNumber=validated_data['chassisNumber'],
            status=StatusScooter.objects.get(id=validated_data['status_id'])
        )
        new_scooter.save()
        return new_scooter


class Deliveryman(models.Model):
    name = models.CharField(max_length=400)
    cpf = models.CharField(max_length=11, default=0, unique=True)
    active = models.BooleanField(default=True)
    objects = models.Manager()

    def create(self, **validated_data):
        print(f"\n\n\n\n validated_data: {validated_data}\n\n\n\n")
        new_deliveryman = Deliveryman(
            name=validated_data['name'],
            cpf=validated_data['cpf'],
            active=validated_data['active']
        )
        new_deliveryman.save()
        return new_deliveryman


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    deliveryman = models.ForeignKey(Deliveryman, on_delete=models.CASCADE, null=True)
    logisticOperator = models.ForeignKey(LogisticOperator, on_delete=models.CASCADE, null=True)
    destinyScooter = models.CharField(max_length=200, blank=True)
    dateMovement = models.DateField(default=date(2000, 1, 1))
    pickUpTime = models.TimeField(null=True)
    returnTime = models.TimeField(null=True)
    accessoriesHelmet = models.BooleanField(default=False)
    accessoriesBag = models.BooleanField(default=False)
    accessoriesCase = models.BooleanField(default=False)
    accessoriesCharger = models.BooleanField(default=False)
    observation = models.CharField(max_length=500, blank=True)
    owner = models.ForeignKey('auth.User', related_name='movement', on_delete=models.CASCADE)
    objects = models.Manager()

    def retrieve(self, id):
        movement = Movement.objects.get(id=id)
        movement_dict = {
            "id": id,
            "scooter": Scooter.objects.get(id=movement.scooter_id).__dict__,
            "scooter_id": Scooter.objects.get(id=movement.scooter_id).id,
            "deliveryman": Deliveryman.objects.get(id=movement.deliveryman_id).__dict__,
            "deliveryman_id": Deliveryman.objects.get(id=movement.deliveryman_id).id,
            "logisticOperator": LogisticOperator.objects.get(id=movement.logisticOperator_id).__dict__,
            "logisticOperator_id": LogisticOperator.objects.get(id=movement.logisticOperator_id).id,
            "destinyScooter": movement.destinyScooter,
            "dateMovement": movement.dateMovement,
            "pickUpTime": movement.pickUpTime,
            "returnTime": movement.returnTime,
            "accessoriesHelmet": movement.accessoriesHelmet,
            "accessoriesBag": movement.accessoriesBag,
            "accessoriesCase": movement.accessoriesCase,
            "accessoriesCharger": movement.accessoriesCharger,
            "observation": movement.observation
        }
        return movement_dict

    def create(self, **validated_data):
        print(f"\n\n\n\n validated_data: {validated_data}\n\n\n\n")
        if validated_data['typeMovement'] != 'devolução':
            new_movement = Movement(
                scooter=Scooter.objects.get(id=validated_data['scooter_id']),
                deliveryman=Deliveryman.objects.get(id=validated_data['deliveryman_id']),
                logisticOperator=LogisticOperator.objects.get(id=validated_data['logisticOperator_id']),
                dateMovement=date.today(),
                pickUpTime=datetime.now().time(),
                accessoriesHelmet=validated_data['accessoriesHelmet'],
                accessoriesBag=validated_data['accessoriesBag'],
                accessoriesCase=validated_data['accessoriesCase'],
                accessoriesCharger=validated_data['accessoriesCharger'],
                observation=validated_data['observation'],
                owner=validated_data['owner']
            )
            new_movement.save()
            return new_movement
    
    def update(self, movement, **validated_data):
        print(f"\n\n\nvalidated_data: {validated_data}")
        print(f"\Movement: {movement}\n\n\n")
        movement.scooter = Scooter.objects.get(
            id=validated_data['scooter_id'])
        movement.deliveryman = Deliveryman.objects.get(
            id=validated_data['deliveryman_id'])
        movement.accessoriesHelmet = validated_data['accessoriesHelmet']
        movement.accessoriesBag = validated_data['accessoriesBag']
        movement.accessoriesCase = validated_data['accessoriesCase']
        movement.accessoriesCharger = validated_data['accessoriesCharger']
        movement.observation = validated_data['observation']
        if validated_data['typeMovement'] == 'devolução':
            # don't let the user changes the return time in update
            if movement.returnTime:
                pass
            else:
                movement.returnTime = datetime.now().time()
            movement.destinyScooter = validated_data['destinyScooter']
        movement.save()
        return movement


