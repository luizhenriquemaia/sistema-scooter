from rest_framework import serializers
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Report, Movement


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

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class MovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movement
        fields = '__all__'
