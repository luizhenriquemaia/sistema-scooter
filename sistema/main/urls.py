from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .api import UserViewSet, StatusScooterViewSet, TypeMovementViewSet, LogisticOperatorViewSet, ScooterViewSet, PeopleRegistrationViewSet, MovementViewSet


router = routers.DefaultRouter()
router.register('api/user', UserViewSet, 'user'),
router.register('api/status-scooter', 
                StatusScooterViewSet, 'status-scooter')
router.register('api/type-movement',
                TypeMovementViewSet, 'type-movement')
router.register('api/logistic-operator',
                LogisticOperatorViewSet, 'logistic-operator')
router.register('api/scooter', 
                ScooterViewSet, 'scooter')
router.register('api/people-registration', PeopleRegistrationViewSet, 'peopleRegistration')
router.register('api/movement', MovementViewSet, 'movement')



urlpatterns = [
    path('api/auth', include('rest_framework.urls'))
]

urlpatterns += router.urls
