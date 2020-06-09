from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Movement


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


class DeliverymanSerializer(serializers.ModelSerializer):
    logisticOperator = LogisticOperatorSerializer(read_only=True)
    logisticOperator_id = serializers.IntegerField()
    class Meta:
        model = Deliveryman
        fields = ['id', 'name', 'cpf', 'logisticOperator',
                  'logisticOperator_id', 'active']
    
    def create(self, validated_data):
        return Deliveryman.create(Deliveryman, **validated_data)


class MovementSerializer(serializers.ModelSerializer):
    scooter = ScooterSerializer(read_only=True)
    scooter_id = serializers.IntegerField()
    deliveryman = DeliverymanSerializer(read_only=True)
    deliveryman_id = serializers.IntegerField()
    logisticOperator = LogisticOperatorSerializer(read_only=True)
    logisticOperator_id = serializers.IntegerField()
    typeMovement = serializers.CharField(required=False)
    destinyScooter = serializers.CharField(required=False)


    class Meta:
        model = Movement
        fields = ['id', 'scooter', 'scooter_id', 'deliveryman',  'deliveryman_id', 'logisticOperator', 'logisticOperator_id',
                  'typeMovement', 'dateMovement', 'pickUpTime', 'returnTime', 'accessoriesHelmet', 'accessoriesBag', 'accessoriesCase',
                  'accessoriesCharger', 'observation', 'destinyScooter']
    
    def create(self, validated_data):
        return Movement.create(Movement, **validated_data)

    def update(self, movement, validated_data):
        return Movement.update(Movement, movement, **validated_data)


class MovementRetrieveSerializer(serializers.ModelSerializer):
    scooter = ScooterSerializer(read_only=False)
    scooter_id = serializers.IntegerField()
    deliveryman = DeliverymanSerializer(read_only=False)
    deliveryman_id = serializers.IntegerField()
    logisticOperator = LogisticOperatorSerializer(read_only=False)
    logisticOperator_id = serializers.IntegerField()
    typeMovement = serializers.CharField(required=False)
    destinyScooter = serializers.CharField(required=False, allow_blank=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Movement
        fields = ['id', 'scooter', 'scooter_id', 'deliveryman',  'deliveryman_id', 'logisticOperator', 'logisticOperator_id',
                  'typeMovement', 'dateMovement', 'pickUpTime', 'returnTime', 'accessoriesHelmet', 'accessoriesBag', 'accessoriesCase',
                  'accessoriesCharger', 'observation', 'destinyScooter', 'owner']
    

