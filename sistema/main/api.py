from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Movement
from .serializers import StatusScooterSerializer, LogisticOperatorSerializer, ScooterSerializer, DeliverymanSerializer, MovementSerializer, MovementRetrieveSerializer


class StatusScooterViewSet(viewsets.ViewSet):
    
    def list(self, request):
        queryset = StatusScooter.objects.all()
        serializer = StatusScooterSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
    
    def create(self, request):
        serializer = StatusScooterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_status_scooter = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogisticOperatorViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = LogisticOperator.objects.all()
        serializer = LogisticOperatorSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        request.data['description'] = request.data['logisticOperatorDescription']
        serializer = LogisticOperatorSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_logistic_operator = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScooterViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Scooter.objects.all()
        serializer = ScooterSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
        
    
    def create(self, request):
        request.data['status_id'] = request.data['statusScooter']
        request.data['chassisNumber'] = request.data['chassisScooter']
        serializer = ScooterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_scooter = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class DeliverymanViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Deliveryman.objects.all()
        serializer = DeliverymanSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        request.data['name'] = request.data['deliverymanName']
        request.data['cpf'] = request.data['cpfDeliverymanToAPI']
        request.data['active'] = request.data['deliverymanActive']
        serializer = DeliverymanSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_deliveryman = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovementViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = Movement.objects.all()
        serializer = MovementSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
    
    def create(self, request):
        request.data['scooter_id'] = Scooter.objects.get(chassisNumber=request.data['scooter']).id
        request.data['logisticOperator_id'] = LogisticOperator.objects.get(description=request.data['OL']).id
        request.data['deliveryman_id'] = Deliveryman.objects.get(cpf=request.data['cpfDeliveryman']).id
        serializer = MovementSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_movement = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk):
        movement = Movement.retrieve(Movement, id=pk)
        serializer = MovementRetrieveSerializer(data=movement)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
