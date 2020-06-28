from datetime import date, datetime

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db import models


class BaseOfWork(models.Model):
    description = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    objects = models.Manager()

    def create(self, **validated_data):
        new_base = BaseOfWork(
            description=validated_data['description'],
            address=validated_data['address']
        )
        new_base.save()
        return new_base


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    base = models.ForeignKey(BaseOfWork, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):        
        new_employee = Employee(
            user=User.objects.get(id=validated_data['user_id']),
            base=BaseOfWork.objects.get(id=validated_data['base_id'])
        )
        new_employee.save()
        return new_employee


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


class LogisticOperator(models.Model):
    description = models.CharField(max_length=200)
    base = models.ForeignKey(BaseOfWork, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        if LogisticOperator.objects.filter(description=validated_data['description']):
            return "this logistic operator already exists"
        else:
            new_logistic_operator = LogisticOperator(
                description=validated_data['description'],
                base=BaseOfWork.objects.get(id=validated_data['base_id'])
            )
            new_logistic_operator.save()
            return new_logistic_operator
 

class Scooter(models.Model):
    chassisNumber = models.CharField(max_length=200)
    status = models.ForeignKey(
        StatusScooter, on_delete=models.CASCADE, null=True)
    base = models.ForeignKey(BaseOfWork, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        if Scooter.objects.filter(chassisNumber=validated_data['chassisNumber']):
            return "this scooter already exists"
        else:
            new_scooter = Scooter(
                chassisNumber=validated_data['chassisNumber'],
                status=StatusScooter.objects.get(id=validated_data['status_id']),
                base=BaseOfWork.objects.get(id=validated_data['base_id'])
            )
            new_scooter.save()
            return new_scooter


class PeopleRegistration(models.Model):
    name = models.CharField(max_length=400)
    cpf = models.CharField(max_length=11, default=0)
    logisticOperator = models.ForeignKey(
        LogisticOperator, on_delete=models.CASCADE, null=True)
    base = models.ForeignKey(BaseOfWork, on_delete=models.CASCADE, null=True)
    objects = models.Manager()

    def create(self, **validated_data):
        if not PeopleRegistration.objects.filter(cpf=validated_data['cpf']):
            new_peopleRegistration = PeopleRegistration(
                name=validated_data['name'],
                cpf=validated_data['cpf'],
                logisticOperator=LogisticOperator.objects.get(
                    id=validated_data['logisticOperator_id']),
                base=BaseOfWork.objects.get(id=validated_data['base_id'])
            )
            new_peopleRegistration.save()
            return new_peopleRegistration


class Movement(models.Model):
    base = models.ForeignKey(BaseOfWork, on_delete=models.CASCADE, null=True)
    scooter = models.ForeignKey(Scooter, on_delete=models.CASCADE, null=True)
    peopleRegistration = models.ForeignKey(PeopleRegistration, on_delete=models.CASCADE, null=True, blank=True)
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
        # internal movements don't have peopleRegistration
        try: 
            PeopleRegistration.objects.get(id=movement.peopleRegistration_id)
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
        except ObjectDoesNotExist:
            movement_dict = {
                "id": id,
                "scooter": Scooter.objects.get(id=movement.scooter_id).__dict__,
                "scooter_id": Scooter.objects.get(id=movement.scooter_id).id,
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
        # case of movement without peopleRegistration
        try:
            people_registration_of_movement = PeopleRegistration.objects.get(
                id=validated_data['peopleRegistration_id'])
            new_movement = Movement(
                scooter=scooter_db,
                peopleRegistration=people_registration_of_movement,
                logisticOperator=LogisticOperator.objects.get(
                    id=validated_data['logisticOperator_id']),
                typeMovement=TypeMovement.objects.get(
                    id=validated_data['typeMovement_id']),
                intialDateMovement=date.today(),
                pickUpTime=datetime.now().time(),
                accessoriesHelmet=validated_data['accessoriesHelmet'],
                accessoriesBag=validated_data['accessoriesBag'],
                accessoriesCase=validated_data['accessoriesCase'],
                accessoriesCharger=validated_data['accessoriesCharger'],
                observation=validated_data['observation'],
                owner=validated_data['owner']
            )
        except KeyError:
            new_movement = Movement(
                scooter=scooter_db,
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
        type_movement_db = TypeMovement.objects.get(
            id=new_movement.typeMovement.id)
        if type_movement_db.description == "Externa":
            scooter_db.status = StatusScooter.objects.get_or_create(
                description="Em uso")[0]
            scooter_db.save()
        elif type_movement_db.description == "Interna":
            if validated_data['destinyScooter'] == "Manutenção" or validated_data['destinyScooter'] == "Backup":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description=validated_data['destinyScooter'])[0]
                scooter_db.save()
        return new_movement
    
    def update(self, movement, **validated_data):
        scooter_db = Scooter.objects.get(id=validated_data['scooter_id'])
        movement.scooter = scooter_db
        # case of movement without peopleRegistration
        try:
            movement.peopleRegistration = PeopleRegistration.objects.get(
                id=validated_data['peopleRegistration_id'])
        except KeyError:
            pass
        movement.logisticOperator = LogisticOperator.objects.get(id=validated_data['logisticOperator_id'])
        movement.accessoriesHelmet = validated_data['accessoriesHelmet']
        movement.accessoriesBag = validated_data['accessoriesBag']
        movement.accessoriesCase = validated_data['accessoriesCase']
        movement.accessoriesCharger = validated_data['accessoriesCharger']
        movement.observation = validated_data['observation']
        movement.intialDateMovement = validated_data['intialDateMovement']
        movement.pickUpTime = validated_data['pickUpTime']
        if validated_data['typeRelease'] == 'Devolução':
            if not movement.returnTime:
                movement.returnTime = datetime.now().time()
                movement.finalDateMovement = date.today()
            else:
                movement.returnTime = validated_data['returnTime']
                movement.finalDateMovement = validated_data['finalDateMovement']
            type_movement_db = TypeMovement.objects.get(id=movement.typeMovement.id)
            if validated_data['destinyScooter'] == "Manutenção":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="Manutenção")[0]
                scooter_db.save()
                # create a internal movement to send scooter to repair
                type_movement_db = TypeMovement.objects.get_or_create(
                    description="Interna")[0]
                new_internal_movement = Movement(
                    scooter = scooter_db,
                    logisticOperator = movement.logisticOperator,
                    typeMovement = type_movement_db,
                    intialDateMovement=date.today(),
                    pickUpTime=datetime.now().time(),
                    owner=movement.owner
                )
                new_internal_movement.save()
            elif validated_data['destinyScooter'] == "Backup":
                scooter_db.status = StatusScooter.objects.get_or_create(
                    description="Backup")[0]
                scooter_db.save()
                # create a internal movement to send scooter to backup
                type_movement_db = TypeMovement.objects.get_or_create(
                    description="Interna")[0]
                new_internal_movement = Movement(
                    scooter = scooter_db,
                    logisticOperator = movement.logisticOperator,
                    typeMovement = type_movement_db,
                    intialDateMovement=date.today(),
                    finalDateMovement = date.today(),
                    pickUpTime=datetime.now().time(),
                    returnTime = datetime.now().time(),
                    owner=movement.owner
                )
                new_internal_movement.save()
            elif validated_data['destinyScooter'] == "Base":
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
