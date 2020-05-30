from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import StatusScooter, Report, Movement
from .serializers import StatusScooterSerializer, ReportSerializer, MovementSerializer


class StatusScooterViewSet(viewsets.ModelViewSet):
    serializer_class = StatusScooterSerializer

    def get_queryset(self):
        return StatusScooter.objects.all()


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer

    def get_queryset(self):
        return Report.objects.all()


class MovementViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Movement.objects.all()
        serializer = MovementSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
