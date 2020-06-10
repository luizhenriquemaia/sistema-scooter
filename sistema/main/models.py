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
    description = models.CharField(max_length=200)
    objects = models.Manager()

    def create(self, **validated_data):
        if LogisticOperator.objects.filter(description=validated_data['description']):
            return "this logistic operator already exists"
        else:
            new_logistic_operator = LogisticOperator(
                description=validated_data['description']
            )
            new_logistic_operator.save()
            return new_logistic_operator
 

class Scooter(models.Model):
    chassisNumber = models.IntegerField()
    status = models.ForeignKey(StatusScooter, on_delete=models.CASCADE, default=0)
    objects = models.Manager()

    def create(self, **validated_data):
        if Scooter.objects.filter(chassisNumber=validated_data['chassisNumber']):
            return "this scooter already exists"
        else:
            new_scooter = Scooter(
                chassisNumber=validated_data['chassisNumber'],
                status=StatusScooter.objects.get(id=validated_data['status_id'])
            )
            new_scooter.save()
            return new_scooter


class Deliveryman(models.Model):
    name = models.CharField(max_length=400)
    cpf = models.CharField(max_length=11, default=0)
    active = models.BooleanField(default=True)
    logisticOperator = models.ForeignKey(
        LogisticOperator, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        if Deliveryman.objects.filter(cpf=validated_data['cpf']):
            return "this deliveryman already exists"
        else:
            new_deliveryman = Deliveryman(
                name=validated_data['name'],
                cpf=validated_data['cpf'],
                logisticOperator=LogisticOperator.objects.get(
                    id=validated_data['logisticOperator_id']),
                active=validated_data['active']
            )
            new_deliveryman.save()
            return new_deliveryman


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    deliveryman = models.ForeignKey(Deliveryman, on_delete=models.CASCADE, null=True)
    logisticOperator = models.ForeignKey(
        LogisticOperator, on_delete=models.CASCADE, null=True)
    destinyScooter = models.CharField(max_length=200, blank=True)
    dateMovement = models.DateField(default=date(2000, 1, 1))
    pickUpTime = models.TimeField(null=True)
    returnTime = models.TimeField(null=True)
    accessoriesHelmet = models.BooleanField(default=False)
    accessoriesBag = models.BooleanField(default=False)
    accessoriesCase = models.BooleanField(default=False)
    accessoriesCharger = models.BooleanField(default=False)
    observation = models.CharField(max_length=500, blank=True)
    owner = models.ForeignKey('auth.User', related_name='movement', on_delete=models.CASCADE, null=True)
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
        scooter_db = Scooter.objects.get(id=validated_data['scooter_id'])
        new_movement = Movement(
            scooter=scooter_db,
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
        # update status of scooter
        scooter_db.status = StatusScooter.objects.get_or_create(description="Em uso")[0]
        scooter_db.save()
        return new_movement
    
    def update(self, movement, **validated_data):
        scooter_db = Scooter.objects.get(id=validated_data['scooter_id'])
        movement.scooter = scooter_db
        movement.deliveryman = Deliveryman.objects.get(
            id=validated_data['deliveryman_id'])
        movement.accessoriesHelmet = validated_data['accessoriesHelmet']
        movement.accessoriesBag = validated_data['accessoriesBag']
        movement.accessoriesCase = validated_data['accessoriesCase']
        movement.accessoriesCharger = validated_data['accessoriesCharger']
        movement.observation = validated_data['observation']
        if validated_data['typeMovement'] == 'devolução':
            # don't let the user changes the return time in update
            if not movement.returnTime:
                movement.returnTime = datetime.now().time()
            if validated_data['destinyScooter'] == "manutenção":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="Manutenção")[0]
                scooter_db.save()
            if validated_data['destinyScooter'] == "base":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="Disponível")[0]
                scooter_db.save()
            movement.destinyScooter = validated_data['destinyScooter']
        movement.save()
        return movement


