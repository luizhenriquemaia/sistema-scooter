from rest_framework import serializers
from .models import StatusScooter, Report, Movement


class StatusScooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusScooter
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class MovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movement
        fields = '__all__'