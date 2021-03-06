from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from main.models import Employee
 
from main.serializers import BaseOfWorkSerializer


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Credenciais incorretas")
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'is_staff', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            is_staff=validated_data['is_staff'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField()
    base = BaseOfWorkSerializer(read_only=True)
    base_id = serializers.IntegerField()

    class Meta:
        model = Employee
        fields = ['user', 'user_id', 'base', 'base_id']

    def create(self, validated_data):
        return Employee.create(Employee, **validated_data)
