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


class TypeMovement(models.Model):
    description = models.CharField(max_length=200)
    objects = models.Manager()

    def create(self, **validated_data):
        new_type_movement = TypeMovement(
            description=validated_data['description']
        )
        new_type_movement.save()
        return new_type_movement


class TypePeople(models.Model):
    description = models.CharField(max_length=200)
    objects = models.Manager()

    def create(self, **validated_data):
        new_type_people = TypePeople(
            description=validated_data['description']
        )
        new_type_people.save()
        return new_type_people


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


class PeopleRegistration(models.Model):
    name = models.CharField(max_length=400)
    cpf = models.CharField(max_length=11, default=0)
    typePeople = models.ForeignKey(TypePeople, on_delete=models.CASCADE, null=True)
    logisticOperator = models.ForeignKey(
        LogisticOperator, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        if not PeopleRegistration.objects.filter(cpf=validated_data['cpf']):
            new_peopleRegistration = PeopleRegistration(
                name=validated_data['name'],
                cpf=validated_data['cpf'],
                typePeople=TypePeople.objects.get(id=validated_data['typePeople_id']),
                logisticOperator=LogisticOperator.objects.get(
                    id=validated_data['logisticOperator_id'])
            )
            new_peopleRegistration.save()
            return new_peopleRegistration


class Movement(models.Model):
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    peopleRegistration = models.ForeignKey(PeopleRegistration, on_delete=models.CASCADE, null=True)
    logisticOperator = models.ForeignKey(
        LogisticOperator, on_delete=models.CASCADE, null=True)
    typeMovement = models.ForeignKey(TypeMovement, on_delete=models.CASCADE, null=True)
    destinyScooter = models.CharField(max_length=200, blank=True)
    intialDateMovement = models.DateField(null=True)
    finalDateMovement = models.DateField(null=True)
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
            "peopleRegistration": PeopleRegistration.objects.get(id=movement.peopleRegistration_id).__dict__,
            "peopleRegistration_id": PeopleRegistration.objects.get(id=movement.peopleRegistration_id).id,
            "logisticOperator": LogisticOperator.objects.get(id=movement.logisticOperator_id).__dict__,
            "logisticOperator_id": LogisticOperator.objects.get(id=movement.logisticOperator_id).id,
            "typeMovement": TypeMovement.objects.get(id=movement.typeMovement_id).__dict__,
            "typeMovement_id": TypeMovement.objects.get(id=movement.typeMovement_id).id,
            "destinyScooter": movement.destinyScooter,
            "intialDateMovement": movement.intialDateMovement,
            "finalDateMovement": movement.finalDateMovement,
            "pickUpTime": movement.pickUpTime,
            "returnTime": movement.returnTime,
            "accessoriesHelmet": movement.accessoriesHelmet,
            "accessoriesBag": movement.accessoriesBag,
            "accessoriesCase": movement.accessoriesCase,
            "accessoriesCharger": movement.accessoriesCharger,
            "observation": movement.observation,
        }
        return movement_dict

    def create(self, **validated_data):
        scooter_db = Scooter.objects.get(id=validated_data['scooter_id'])
        new_movement = Movement(
            scooter=scooter_db,
            peopleRegistration=PeopleRegistration.objects.get(id=validated_data['peopleRegistration_id']),
            logisticOperator=LogisticOperator.objects.get(id=validated_data['logisticOperator_id']),
            typeMovement=TypeMovement.objects.get(id=validated_data['typeMovement_id']),
            intialDateMovement=date.today(),
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
        movement.peopleRegistration = PeopleRegistration.objects.get(
            id=validated_data['peopleRegistration_id'])
        movement.accessoriesHelmet = validated_data['accessoriesHelmet']
        movement.accessoriesBag = validated_data['accessoriesBag']
        movement.accessoriesCase = validated_data['accessoriesCase']
        movement.accessoriesCharger = validated_data['accessoriesCharger']
        movement.observation = validated_data['observation']
        movement.intialDateMovement = validated_data['intialDateMovement']
        movement.pickUpTime = validated_data['pickUpTime']
        if validated_data['typeRelease'] == 'devolução':
            if not movement.returnTime:
                movement.returnTime = datetime.now().time()
                movement.finalDateMovement = date.today()
            else:
                movement.returnTime = validated_data['returnTime']
                movement.finalDateMovement = validated_data['finalDateMovement']
            if validated_data['destinyScooter'] == "manutencao":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="manutencao")[0]
                scooter_db.save()
                # create a internal movement to "manutencao"
                type_movement_db = TypeMovement.objects.get_or_create(
                    description="manutencao")[0]
                new_internal_movement = Movement(
                    scooter = scooter_db,
                    typeMovement = type_movement_db,
                    intialDateMovement=date.today(),
                    pickUpTime=datetime.now().time(),
                    owner=movement.owner
                )
                new_internal_movement.save()
            if validated_data['destinyScooter'] == "base":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="Disponível")[0]
                scooter_db.save()
            movement.destinyScooter = validated_data['destinyScooter']
        movement.save()
        return movement
    
    def destroy(self, id):
        movement_to_destroy = Movement.objects.get(id=id)
        if not movement_to_destroy.returnTime:
            scooter_db = Scooter.objects.get(id=movement_to_destroy.scooter.id)
            scooter_db.status = StatusScooter.objects.get_or_create(
                description="Disponível")[0]
            scooter_db.save()
        movement_to_destroy.delete()



