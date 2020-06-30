from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from main.models import BaseOfWork, Employee


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username']
 

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Credenciais incorretas")
    

class BaseOfWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseOfWork
        fields = ['id', 'description', 'address']

    def create(self, validated_data):
        return BaseOfWork.create(BaseOfWork, **validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'is_staff', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            is_staff=validated_data['is_staff']
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
