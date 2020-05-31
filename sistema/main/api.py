from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Report, Movement
from .serializers import StatusScooterSerializer, LogisticOperatorSerializer, ScooterSerializer, DeliverymanSerializer, ReportSerializer, MovementSerializer


class StatusScooterViewSet(viewsets.ModelViewSet):
    serializer_class = StatusScooterSerializer

    def get_queryset(self):
        return StatusScooter.objects.all()


class LogisticOperatorViewSet(viewsets.ModelViewSet):
    serializer_class = LogisticOperatorSerializer

    def get_queryset(self):
        return LogisticOperator.objects.all()


class ScooterViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Scooter.objects.all()
        serializer = ScooterSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


class DeliverymanViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverymanSerializer

    def get_queryset(self):
        return Deliveryman.objects.all()

        
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
