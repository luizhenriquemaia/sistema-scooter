from rest_framework import routers
from .api import StatusScooterViewSet, ReportViewSet, MovementViewSet


router = routers.DefaultRouter()
router.register('api/status-scooter', StatusScooterViewSet, 'status-scooter')
router.register('api/report', ReportViewSet, 'report')
router.register('api/movement', MovementViewSet, 'movement')


urlpatterns = router.urls
