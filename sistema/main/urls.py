from django.urls import path
from django.conf.urls import include
from rest_framework import routers
from .api import UserViewSet, StatusScooterViewSet, LogisticOperatorViewSet, ScooterViewSet, DeliverymanViewSet, MovementViewSet


router = routers.DefaultRouter()
router.register('api/user', UserViewSet, 'user'),
router.register('api/status-scooter', 
                StatusScooterViewSet, 'status-scooter')
router.register('api/logistic-operator',
                LogisticOperatorViewSet, 'logistic-operator')
router.register('api/scooter', 
                ScooterViewSet, 'scooter')
router.register('api/deliveryman', DeliverymanViewSet, 'deliveryman')
router.register('api/movement', MovementViewSet, 'movement')


urlpatterns = [
    path('api/auth', include('rest_framework.urls'))
]

urlpatterns += router.urls
