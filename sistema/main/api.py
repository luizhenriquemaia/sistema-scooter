from datetime import datetime
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import StatusScooter, TypeMovement, TypePeople, LogisticOperator, Scooter, PeopleRegistration, Movement
from .serializers import UserSerializer, StatusScooterSerializer, LogisticOperatorSerializer, ScooterSerializer, PeopleRegistrationSerializer, MovementSerializer, MovementRetrieveSerializer


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
            return Response("Nenhum operador logístico encontrado", status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        try:
            LogisticOperator.objects.get(description=request.data['logisticOperatorDescription'])
            return Response("OL já cadastrada", status=status.HTTP_400_BAD_REQUEST) 
        except ObjectDoesNotExist:
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
            return Response("nenhum patinete encontrado", status=status.HTTP_204_NO_CONTENT)
        
    def create(self, request):
        try: 
            Scooter.objects.get(chassisNumber=request.data['chassisScooter'])
            return Response("patinete já cadastrado", status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
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
        


class PeopleRegistrationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = PeopleRegistration.objects.all()
        serializer = PeopleRegistrationSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response("nenhum entregador encontrado", status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        try:
            PeopleRegistration.objects.get(cpf=request.data['cpfPeopleRegistrationToAPI'])
            return Response("CPF já cadastrado", status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            request.data['name'] = request.data['peopleRegistrationName']
            request.data['cpf'] = request.data['cpfPeopleRegistrationToAPI']
            request.data['active'] = request.data['peopleRegistrationActive']
            try:
                LogisticOperator.objects.get(
                    description=request.data['logisticOperatorPeopleRegistration'])
            except ObjectDoesNotExist:
                return Response("OL não cadastrada", status=status.HTTP_400_BAD_REQUEST)
            request.data['logisticOperator_id'] = LogisticOperator.objects.get(
                description=request.data['logisticOperatorPeopleRegistration']).id
            if request.data['typePeopleToAPI'] != "entregador" and request.data['typePeopleToAPI'] != "manutencao":
                return Response("Tipo de pessoa incorreto", status=status.HTTP_400_BAD_REQUEST)
            request.data['typePeople_id'] = TypePeople.objects.get_or_create(description=request.data['typePeopleToAPI'])[0].id
            serializer = PeopleRegistrationSerializer(data=request.data)
            try:
                if serializer.is_valid(raise_exception=True):
                    new_people_registration = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except AttributeError:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovementViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        query_from_url_initial_date = request.GET.get("initialDate")
        query_from_url_final_date = request.GET.get("finalDate")
        query_from_url_type_movement = request.GET.get("typeMovement")
        typeMovement = TypeMovement.objects.get(description=query_from_url_type_movement).id
        if request.user.is_staff or request.user.is_superuser:
            if query_from_url_initial_date and query_from_url_final_date:
                queryset_list = Movement.objects.filter(intialDateMovement__range=(
                    query_from_url_initial_date, query_from_url_final_date), typeMovement=typeMovement)
            else:
                queryset_list = Movement.objects.filter(intialDateMovement=datetime.today(), typeMovement=typeMovement)
        else:
            if query_from_url_initial_date and query_from_url_final_date:
                queryset_list = Movement.objects.filter(intialDateMovement__range=(
                    query_from_url_initial_date, query_from_url_final_date), owner=request.user, typeMovement=typeMovement)
            else:
                queryset_list = Movement.objects.filter(
                    intialDateMovement=datetime.today(), owner=request.user, typeMovement=typeMovement)
        serializer = MovementSerializer(queryset_list, many=True)
        if len(serializer.data) > 0:
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, pk):
        if not request.user.is_staff or not request.user.is_superuser:
            try:
                Movement.objects.get(id=pk, owner=request.user)
            except ObjectDoesNotExist:
                return Response("você não é autorizado a realizar esta ação", status=status.HTTP_403_FORBIDDEN)
        movement = Movement.retrieve(Movement, id=pk)
        serializer = MovementRetrieveSerializer(data=movement)
        if serializer.is_valid(raise_exception=True):
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

    def create(self, request):
        try: 
            Scooter.objects.get(chassisNumber=request.data['scooter'])
        except ObjectDoesNotExist:
            return Response("Patinete não existente", status=status.HTTP_400_BAD_REQUEST)
        try:
            PeopleRegistration.objects.get(cpf=request.data['cpfPeopleRegistration'])
        except ObjectDoesNotExist:
            return Response("Responsável não cadastrado", status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data['scooter_id'] = Scooter.objects.get(chassisNumber=request.data['scooter']).id
            if request.data['typeRelease'] != 'devolução':
                if request.data['typeMovement'] != 'entregas':
                    if request.data['typeMovement'] != 'manutencao':
                        return Response("Tipo de movimentação incorreta", status=status.HTTP_400_BAD_REQUEST)
                request.data['typeMovement_id'] = TypeMovement.objects.get_or_create(description=request.data['typeMovement'])[0].id
                scooter_db = Scooter.objects.get(id=request.data['scooter_id'])
                if scooter_db.status.description == "Disponível":
                    people_registration_movement = PeopleRegistration.objects.get(cpf=request.data['cpfPeopleRegistration'])
                    request.data['logisticOperator_id'] = people_registration_movement.logisticOperator_id
                    request.data['peopleRegistration_id'] = people_registration_movement.id
                    serializer = MovementSerializer(data=request.data)
                    if serializer.is_valid(raise_exception=True):
                        new_movement = serializer.save(owner=self.request.user)
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    else:
                        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response("Patinete não disponível", status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("Tipo de lançamento incorreto", status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk):
        movement = Movement.objects.get(id=pk)
        if request.user.is_staff:
            try:
                request.data['scooter_id'] = Scooter.objects.get(chassisNumber=request.data['scooter']).id
                request.data['logisticOperator_id'] = LogisticOperator.objects.get(description=request.data['LO']).id
                request.data['peopleRegistration_id'] = PeopleRegistration.objects.get(cpf=request.data['cpfPeopleRegistration']).id
                if request.data['initialTimeFormatted'] != "":
                    request.data['pickUpTime'] = request.data['initialTimeFormatted']
                if request.data['finalTimeFormatted'] != "":
                    request.data['returnTime'] = request.data['finalTimeFormatted']
            except ObjectDoesNotExist:
                return Response("valor(es) não existente(s) na base de dados", status=status.HTTP_400_BAD_REQUEST)
        else:
            # if user is not staff he can only changes the destiny and type of release
            request.data['scooter_id'] = movement.scooter_id
            request.data['logisticOperator_id'] = movement.logisticOperator_id
            request.data['peopleRegistration_id'] = movement.peopleRegistration_id
            request.data['accessoriesHelmet'] = movement.accessoriesHelmet
            request.data['accessoriesBag'] = movement.accessoriesBag
            request.data['accessoriesCase'] = movement.accessoriesCase
            request.data['accessoriesCharger'] = movement.accessoriesCharger
            request.data['intialDateMovement'] = movement.intialDateMovement
            request.data['finalDateMovement'] = movement.finalDateMovement
            request.data['pickUpTime'] = movement.pickUpTime
            request.data['returnTime'] = movement.returnTime
        request.data['typeMovement_id'] = movement.typeMovement_id
        serializer = MovementSerializer(movement, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk):
        permission_classes = [permissions.IsAuthenticated]
        if request.user.is_staff or request.user.is_superuser:
            serializer = MovementSerializer
            Movement.destroy(Movement, id=pk)
            return Response("movimentação deletada com sucesso", status=status.HTTP_204_NO_CONTENT)
        else:
            return Response("é necessário ser administrador para excluir um registro", status=status.HTTP_401_UNAUTHORIZED)
