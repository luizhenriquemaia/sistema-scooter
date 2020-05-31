from rest_framework import routers
from .api import StatusScooterViewSet, LogisticOperatorViewSet, ScooterViewSet, DeliverymanViewSet, MovementViewSet


router = routers.DefaultRouter()
router.register('api/status-scooter', 
                StatusScooterViewSet, 'status-scooter')
router.register('api/logistic-operator',
                LogisticOperatorViewSet, 'logistic-operator')
router.register('api/scooter', 
                ScooterViewSet, 'scooter')
router.register('api/deliveryman', DeliverymanViewSet, 'deliveryman')
router.register('api/movement', MovementViewSet, 'movement')


urlpatterns = router.urls
