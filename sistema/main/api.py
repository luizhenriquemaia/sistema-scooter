from datetime import datetime
from django.contrib.auth.models import User
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import StatusScooter, LogisticOperator, Scooter, Deliveryman, Movement
from .serializers import UserSerializer, StatusScooterSerializer, LogisticOperatorSerializer, ScooterSerializer, DeliverymanSerializer, MovementSerializer, MovementRetrieveSerializer


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StatusScooterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
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
    permission_classes = [permissions.IsAuthenticated]

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
        try:
            if serializer.is_valid(raise_exception=True):
                new_logistic_operator = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except AttributeError:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScooterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

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
        try:
            if serializer.is_valid(raise_exception=True):
                new_scooter = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except AttributeError:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class DeliverymanViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

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
        request.data['logisticOperator_id'] = LogisticOperator.objects.get(
            description=request.data['logisticOperatorDeliveryman']).id
        serializer = DeliverymanSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                new_deliveryman = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except AttributeError:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovementViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        query_from_url_initial_date = request.GET.get("initialDate")
        query_from_url_final_date = request.GET.get("finalDate")
        if request.user.is_staff or request.user.is_superuser:
            if query_from_url_initial_date and query_from_url_final_date:
                queryset_list = Movement.objects.filter(dateMovement__range=(
                    query_from_url_initial_date, query_from_url_final_date))
            else:
                queryset_list = Movement.objects.filter(dateMovement=datetime.today())
        else:
            if query_from_url_initial_date and query_from_url_final_date:
                queryset_list = Movement.objects.filter(dateMovement__range=(
                    query_from_url_initial_date, query_from_url_final_date), owner=request.user)
            else:
                queryset_list = Movement.objects.filter(dateMovement=datetime.today(), owner=request.user)
        serializer = MovementSerializer(queryset_list, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, pk):
        movement = Movement.retrieve(Movement, id=pk)
        serializer = MovementRetrieveSerializer(data=movement)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        request.data['scooter_id'] = Scooter.objects.get(
            chassisNumber=request.data['scooter']).id
        deliverymanMovement = Deliveryman.objects.get(
            cpf=request.data['cpfDeliveryman'])
        request.data['logisticOperator_id'] = deliverymanMovement.logisticOperator_id
        request.data['deliveryman_id'] = deliverymanMovement.id
        serializer = MovementSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_movement = serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk):
        print(f'\n\n\ndata = {request.data}\n\n\n')
        movement = Movement.objects.get(id=pk)
        if request.user.is_staff:
            try:
                request.data['scooter_id'] = Scooter.objects.get(chassisNumber=request.data['scooter']).id
                request.data['logisticOperator_id'] = LogisticOperator.objects.get(description=request.data['LO']).id
                request.data['deliveryman_id'] = Deliveryman.objects.get(cpf=request.data['cpfDeliveryman']).id
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data['scooter_id'] = movement.scooter_id
            request.data['logisticOperator_id'] = movement.logisticOperator_id
            request.data['deliveryman_id'] = movement.deliveryman_id
        serializer = MovementSerializer(movement, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
