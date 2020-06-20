import json

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from main.api import MovementViewSet


class MovementViewSetTestCase(APITestCase):

    list_url = reverse("movement")

    def setUp(self):
        self.user = User.objects.create_user(username="davinci",
                                             password="some-very-strong-psw")    
        self.token = Token.objects.create(user=self.user)

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_movement_list_authenticated(self):
        response = self.cliente.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_movement_list_un_authenticated(self):
        self.cliente.force_authenticate(user=None)
        response = self.cliente.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
