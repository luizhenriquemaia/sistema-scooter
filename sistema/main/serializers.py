from rest_framework import serializers
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Movement


class StatusScooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusScooter
        fields = '__all__'


class LogisticOperatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogisticOperator
        fields = '__all__'

class ScooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scooter
        fields = '__all__'


class DeliverymanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deliveryman
        fields = '__all__'


class MovementSerializer(serializers.ModelSerializer):
    scooter = ScooterSerializer(read_only=True)
    scooter_id = serializers.IntegerField()
    deliveryman = DeliverymanSerializer(read_only=True)
    deliveryman_id = serializers.IntegerField()
    logisticOperator = LogisticOperatorSerializer(read_only=True)
    logisticOperator_id = serializers.IntegerField()
    typeMovement = serializers.CharField(required=False)


    class Meta:
        model = Movement
        fields = ['id', 'scooter', 'scooter_id', 'deliveryman',  'deliveryman_id', 'logisticOperator', 'logisticOperator_id',
                  'typeMovement', 'dateMovement', 'pickUpTime', 'returnTime', 'accessoriesHelmet', 'accessoriesBag', 'accessoriesCase',
                  'accessoriesCharger', 'observation']
    
    def create(self, validated_data):
        return Movement.create(Movement, **validated_data)
    

