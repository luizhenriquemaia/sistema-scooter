from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import StatusScooter, TypeMovement, LogisticOperator, Scooter, PeopleRegistration, Movement


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class StatusScooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusScooter
        fields = ['id', 'description']

    def create(self, validated_data):
        return StatusScooter.create(StatusScooter, **validated_data)


class TypeMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeMovement
        fields = ['id', 'description']

    def create(self, validated_data):
        return TypeMovement.create(TypeMovement, **validated_data)


class LogisticOperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticOperator
        fields = ['id', 'description']

    def create(self, validated_data):
        return LogisticOperator.create(LogisticOperator, **validated_data)

class ScooterSerializer(serializers.ModelSerializer):
    status = StatusScooterSerializer(read_only=True)
    status_id = serializers.IntegerField()
    class Meta:
        model = Scooter
        fields = ['id', 'chassisNumber', 'status', 'status_id']
    
    def create(self, validated_data):
        return Scooter.create(Scooter, **validated_data)


class PeopleRegistrationSerializer(serializers.ModelSerializer):
    logisticOperator = LogisticOperatorSerializer(read_only=True)
    logisticOperator_id = serializers.IntegerField()

    class Meta:
        model = PeopleRegistration
        fields = ['id', 'name', 'cpf', 'logisticOperator',
                  'logisticOperator_id']
    
    def create(self, validated_data):
        return PeopleRegistration.create(PeopleRegistration, **validated_data)
            


class MovementSerializer(serializers.ModelSerializer):
    scooter = ScooterSerializer(read_only=True)
    scooter_id = serializers.IntegerField()
    peopleRegistration = PeopleRegistrationSerializer(read_only=True)
    peopleRegistration_id = serializers.IntegerField(required=False, allow_null=True)
    logisticOperator = LogisticOperatorSerializer(read_only=True)
    logisticOperator_id = serializers.IntegerField()
    typeMovement = TypeMovementSerializer(read_only=True)
    typeMovement_id = serializers.IntegerField()
    typeRelease = serializers.CharField(required=False)
    destinyScooter = serializers.CharField(required=False)

    class Meta:
        model = Movement
        fields = ['id', 'scooter', 'scooter_id', 'peopleRegistration',  'peopleRegistration_id', 'logisticOperator', 'logisticOperator_id',
                  'typeMovement', 'typeMovement_id','typeRelease', 'intialDateMovement', 'finalDateMovement', 'pickUpTime', 'returnTime', 
                  'accessoriesHelmet', 'accessoriesBag', 'accessoriesCase', 'accessoriesCharger', 'observation', 'destinyScooter']
    
    def create(self, validated_data):
        return Movement.create(Movement, **validated_data)

    def update(self, movement, validated_data):
        return Movement.update(Movement, movement, **validated_data)


class MovementRetrieveSerializer(serializers.ModelSerializer):
    scooter = ScooterSerializer(read_only=False)
    scooter_id = serializers.IntegerField()
    peopleRegistration = PeopleRegistrationSerializer(read_only=False, required=False)
    peopleRegistration_id = serializers.IntegerField(required=False, allow_null=True)
    logisticOperator = LogisticOperatorSerializer(read_only=False)
    logisticOperator_id = serializers.IntegerField()
    typeMovement = TypeMovementSerializer(read_only=False)
    typeMovement_id = serializers.IntegerField()
    typeRelease = serializers.CharField(required=False)
    destinyScooter = serializers.CharField(required=False, allow_blank=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Movement
        fields = ['id', 'scooter', 'scooter_id', 'peopleRegistration',  'peopleRegistration_id', 
                  'logisticOperator', 'logisticOperator_id', 'typeMovement', 'typeMovement_id', 
                  'typeRelease', 'intialDateMovement', 'finalDateMovement', 'pickUpTime', 'returnTime',
                  'accessoriesHelmet', 'accessoriesBag', 'accessoriesCase', 'accessoriesCharger', 'observation', 
                  'destinyScooter', 'owner']
    

