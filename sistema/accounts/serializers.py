from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from main.models import BaseOfWork


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
 

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
