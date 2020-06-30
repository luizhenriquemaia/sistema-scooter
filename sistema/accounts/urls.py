from django.urls import include, path
from knox import views as knox_views
from rest_framework import routers

from .api import EmployeeViewSet, LoginAPI, UserAPI

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/user', UserAPI.as_view()),
    path('api/auth/login', LoginAPI.as_view()),
    path('api/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
]

router = routers.DefaultRouter()
router.register('api/auth/employee', EmployeeViewSet, 'employee')

urlpatterns += router.urls
