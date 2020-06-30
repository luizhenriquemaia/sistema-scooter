from django.conf.urls import include
from django.urls import path
from rest_framework import routers

from .api import (EmployeeViewSet,
                  LogisticOperatorViewSet, MovementViewSet,
                  PeopleRegistrationViewSet, ScooterViewSet,
                  StatusScooterViewSet, TypeMovementViewSet)

router = routers.DefaultRouter()
router.register('api/employee',
                EmployeeViewSet, 'employee')
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

urlpatterns = router.urls
