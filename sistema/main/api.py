from datetime import datetime

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from .models import (BaseOfWork, Employee, LogisticOperator, Movement, PeopleRegistration,
                     Scooter, StatusScooter, TypeMovement)
from .serializers import (BaseOfWorkSerializer, LogisticOperatorSerializer,
                          MovementRetrieveSerializer, MovementSerializer,
                          PeopleRegistrationSerializer, ScooterSerializer,
                          StatusScooterSerializer, TypeMovementSerializer)


class BaseOfWorkViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        if request.user.is_staff:
            queryset = BaseOfWork.objects.all()
            serializer = BaseOfWorkSerializer(queryset, many=True)
            if len(serializer.data) > 0:
                return Response({"serializer": serializer.data,
                                 "message": ""}, status=status.HTTP_200_OK)
            else:
                return Response({"serializer": serializer.data,
                                 "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        if request.user.is_staff:
            serializer = BaseOfWorkSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_base_of_work = serializer.save()
                return Response({"serializer": serializer.data,
                                 "message": "Base adicionada com sucesso"}, status=status.HTTP_201_CREATED)
            return Response({"serializer": serializer.errors,
                             "message": "Erro ao criar a base"}, status=status.HTTP_400_BAD_REQUEST)


class StatusScooterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        queryset = StatusScooter.objects.all()
        serializer = StatusScooterSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response({"serializer": serializer.data,
                            "message": ""}, status=status.HTTP_200_OK)
        else:
            return Response({"serializer": serializer.data,
                            "message": ""}, status=status.HTTP_204_NO_CONTENT)

    
    def create(self, request):
        if request.user.is_staff:
            serializer = StatusScooterSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_status_scooter = serializer.save()
                return Response({"serializer": serializer.data,
                                "message": "Status do patinete adicionado com sucesso"}, status=status.HTTP_201_CREATED)
            return Response({"serializer": serializer.errors,
                            "message": "Erro ao adicionar status do patinete"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"serializer": "",
                             "message": "Não autorizado"}, status=status.HTTP_401_UNAUTHORIZED)


class TypeMovementViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = TypeMovement.objects.all()
        serializer = TypeMovementSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_200_OK)
        else:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        serializer = TypeMovementSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_status_scooter = serializer.save()
            return Response({"serializer": serializer.data,
                             "message": "Tipo de movimentação criada com sucesso"}, status=status.HTTP_201_CREATED)
        return Response({"serializer": serializer.errors,
                         "message": "Erro criar tipo de movimentação"}, status=status.HTTP_400_BAD_REQUEST)


class LogisticOperatorViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        queryset = LogisticOperator.objects.filter(base_id=base_employee)
        serializer = LogisticOperatorSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_200_OK)
        else:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        try:
            LogisticOperator.objects.get(description=request.data['logisticOperatorDescription'], base_id=base_employee)
            return Response({"serializer": "",
                             "message": "OL já cadastrada"}, status=status.HTTP_400_BAD_REQUEST) 
        except ObjectDoesNotExist:
            request.data['description'] = request.data['logisticOperatorDescription']
            request.data['base_id'] = base_employee
            serializer = LogisticOperatorSerializer(data=request.data)
            try:
                if serializer.is_valid(raise_exception=True):
                    new_logistic_operator = serializer.save()
                    return Response({"serializer": serializer.data,
                                     "message": "OL criada com sucesso"}, status=status.HTTP_201_CREATED)
            except AttributeError:
                return Response({"serializer": serializer.errors,
                                 "message": "Erro ao cadastrar a OL"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"serializer": serializer.errors,
                             "message": "Erro ao cadastrar a OL"}, status=status.HTTP_400_BAD_REQUEST)


class ScooterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        queryset = Scooter.objects.filter(base_id=base_employee)
        serializer = ScooterSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_200_OK)
        else:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_204_NO_CONTENT)
        
    def create(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        if len(request.data['chassisScooter']) < 4:
            return Response({"serializer": "",
                             "message": "o chassi deve ter pelo menos 4 dígitos"}, status=status.HTTP_400_BAD_REQUEST)
        try: 
            Scooter.objects.get(
                chassisNumber=request.data['chassisScooter'], base_id=base_employee)
            return Response({"serializer": "",
                             "message": "patinete já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            request.data['status_id'] = request.data['statusScooter']
            request.data['chassisNumber'] = request.data['chassisScooter']
            request.data['base_id'] = base_employee
            serializer = ScooterSerializer(data=request.data)
            try:
                if serializer.is_valid(raise_exception=True):
                    new_scooter = serializer.save()
                    return Response({"serializer": serializer.data,
                                     "message": "Patinete adicionado com sucesso"}, status=status.HTTP_201_CREATED)
            except AttributeError:
                return Response({"serializer": serializer.errors,
                                 "message": "Erro ao adicionar patinete"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"serializer": serializer.errors,
                             "message": "Erro ao adicionar patinete"}, status=status.HTTP_400_BAD_REQUEST)
        


class PeopleRegistrationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        queryset = PeopleRegistration.objects.filter(base_id=base_employee)
        serializer = PeopleRegistrationSerializer(queryset, many=True)
        if len(serializer.data) > 0:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_200_OK)
        else:
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        try:
            PeopleRegistration.objects.get(
                cpf=request.data['cpfPeopleRegistrationToAPI'], base_id=base_employee)
            return Response({"serializer": "",
                             "message": "CPF já cadastrado"}, status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            request.data['name'] = request.data['peopleRegistrationName']
            request.data['cpf'] = request.data['cpfPeopleRegistrationToAPI']
            request.data['base_id'] = base_employee
            try:
                LogisticOperator.objects.get(
                    id=request.data['logisticOperatorPeopleRegistration'])
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                                 "message": "OL não cadastrada"}, status=status.HTTP_400_BAD_REQUEST)
            request.data['logisticOperator_id'] = LogisticOperator.objects.get(
                id=request.data['logisticOperatorPeopleRegistration']).id
            serializer = PeopleRegistrationSerializer(data=request.data)
            try:
                if serializer.is_valid(raise_exception=True):
                    new_people_registration = serializer.save()
                    return Response({"serializer": serializer.data,
                                     "message": "Entregador adicionado com sucesso"}, status=status.HTTP_201_CREATED)
            except AttributeError:
                return Response({"serializer": serializer.errors,
                                 "message": "Erro ao adicionar entregador"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"serializer": serializer.errors,
                             "message": "Erro ao adicionar entregador"}, status=status.HTTP_400_BAD_REQUEST)


class MovementViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        if request.GET.get("chassis"):
            query_from_url_chassis = request.GET.get("chassis")
            try:
                id_scooter_from_db = Scooter.objects.get(
                    chassisNumber=query_from_url_chassis, base_id=base_employee).id
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                             "message": ""}, status=status.HTTP_204_NO_CONTENT)
            queryset_list = Movement.objects.filter(scooter_id=id_scooter_from_db, base_id=base_employee).order_by('id').last()
            # if there is not a movement in scooter yet
            try:
               if queryset_list.returnTime:
                   return Response({"serializer": "", "message": ""}, status=status.HTTP_204_NO_CONTENT)
            except:
                return Response({"serializer": "", "message": ""}, status=status.HTTP_204_NO_CONTENT)
            serializer = MovementSerializer(queryset_list, many=False)
            if serializer.data:
                return Response({"serializer": serializer.data,
                                "message": ""}, status=status.HTTP_200_OK)
            else:
                return Response({"serializer": serializer.data,
                                "message": ""}, status=status.HTTP_204_NO_CONTENT)
        else:
            query_from_url_initial_date = request.GET.get("initialDate")
            query_from_url_final_date = request.GET.get("finalDate")
            if request.user.is_staff or request.user.is_superuser:
                if query_from_url_initial_date and query_from_url_final_date:
                    queryset_list = Movement.objects.filter(intialDateMovement__range=(
                        query_from_url_initial_date, query_from_url_final_date), base_id=base_employee)
                else:
                    queryset_list = Movement.objects.filter(
                        intialDateMovement=datetime.today(), base_id=base_employee)
            else:
                if query_from_url_initial_date and query_from_url_final_date:
                    queryset_list = Movement.objects.filter(intialDateMovement__range=(
                        query_from_url_initial_date, query_from_url_final_date), owner=request.user)
                else:
                    queryset_list = Movement.objects.filter(
                        intialDateMovement=datetime.today(), owner=request.user)
            serializer = MovementSerializer(queryset_list, many=True)
            if len(serializer.data) > 0:
                return Response({"serializer": serializer.data,
                                "message": ""}, status=status.HTTP_200_OK)
            else:
                return Response({"serializer": serializer.data,
                                "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, pk):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        if not request.user.is_staff or not request.user.is_superuser:
            try:
                Movement.objects.get(id=pk, owner=request.user, base_id=base_employee)
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                                 "message": "Você não é autorizado a realizar esta ação"}, status=status.HTTP_403_FORBIDDEN)
        if request.user.is_staff:
            try:
                Movement.objects.get(
                    id=pk, base_id=base_employee)
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                                 "message": "Você não é autorizado a realizar esta ação"}, status=status.HTTP_403_FORBIDDEN)
        movement = Movement.retrieve(Movement, id=pk)
        serializer = MovementRetrieveSerializer(data=movement)
        if serializer.is_valid(raise_exception=True):
            return Response({"serializer": serializer.data,
                             "message": ""}, status=status.HTTP_200_OK)
        return Response({"serializer": serializer.errors,
                         "message": "Erro ao retornar movimentação"}, status=status.HTTP_400_BAD_REQUEST)
            

    def create(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        request.data['base_id'] = base_employee
        if request.data['typeMovement'] != 'Externa' and request.data['typeMovement'] != 'Interna':
            return Response({"serializer": "",
                             "message": "Tipo de movimentação incorreta"}, status=status.HTTP_400_BAD_REQUEST)
        try: 
            Scooter.objects.get(
                chassisNumber=request.data['scooter'], base_id=base_employee)
        except ObjectDoesNotExist:
            return Response({"serializer": "",
                            "message": "Patinete não existente"}, status=status.HTTP_400_BAD_REQUEST)
        if request.data['typeMovement'] == "Externa":
            try:
                id_deliveryman_db = PeopleRegistration.objects.get(
                    cpf=request.data['cpfPeopleRegistration'], base_id=base_employee).id
                last_movement_deliveryman_db = Movement.objects.filter(
                    peopleRegistration_id=id_deliveryman_db, base_id=base_employee).order_by('id').last()
                try: 
                    if last_movement_deliveryman_db.returnTime == None:
                        return Response({"serializer": "",
                                        "message": "Entregador com movimentação em aberto"}, status=status.HTTP_400_BAD_REQUEST)
                except:
                    pass
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                                 "message": "Entregador não cadastrado"}, status=status.HTTP_400_BAD_REQUEST)
        request.data['scooter_id'] = Scooter.objects.get(
            chassisNumber=request.data['scooter'], base_id=base_employee).id
        scooter_db = Scooter.objects.get(id=request.data['scooter_id'])
        if scooter_db.status.description != "Disponível" and scooter_db.status.description != "Backup":
            return Response({"serializer": "",
                            "message": "Patinete não disponível"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data['typeMovement_id'] = TypeMovement.objects.get_or_create(
                description=request.data['typeMovement'])[0].id
            if request.data['typeMovement'] == "Externa":
                people_registration_movement = PeopleRegistration.objects.get(
                    cpf=request.data['cpfPeopleRegistration'], base_id=base_employee)
                request.data['logisticOperator_id'] = people_registration_movement.logisticOperator_id
                request.data['peopleRegistration_id'] = people_registration_movement.id
            # internal movements does not need accessories
            elif request.data['typeMovement'] == "Interna":
                if request.data['destinyScooterToAPI'] == "maintenance" or request.data['destinyScooterToAPI'] == "Manutenção":
                    request.data['destinyScooter']  = "Manutenção"
                elif request.data['destinyScooterToAPI'] == "backup" or request.data['destinyScooterToAPI'] == "Backup":
                    request.data['destinyScooter']  = "Backup"
                request.data['logisticOperator_id'] = request.data['logisticOperatorMovement']
                request.data['accessoriesHelmet'] = False
                request.data['accessoriesBag'] = False
                request.data['accessoriesCase'] = False
                request.data['accessoriesCharger'] = False
            serializer = MovementSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                new_movement = serializer.save(owner=self.request.user)
                return Response({"serializer": serializer.data,
                                "message": "movimentação criada"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"serializer": serializer.errors,
                                 "message": "Erro ao criar movimentação"}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        try:
            movement = Movement.objects.get(id=pk, base_id=base_employee)
        except ObjectDoesNotExist:
            return Response({"serializer": "",
                             "message": "Não autorizado"}, status=status.HTTP_401_UNAUTHORIZED)
        if request.user.is_staff:
            try:
                request.data['scooter_id'] = Scooter.objects.get(
                    chassisNumber=request.data['scooter'], base_id=base_employee).id
                request.data['logisticOperator_id'] = LogisticOperator.objects.get(
                    id=request.data['logisticOperatorMovement'], base_id=base_employee).id
                # if this data was not passed don't need to update them
                try:
                    request.data['peopleRegistration_id'] = PeopleRegistration.objects.get(cpf=request.data['cpfPeopleRegistration'], base_id=base_employee).id
                except: pass
                try:
                    if request.data['initialTimeFormatted'] != "":
                        request.data['pickUpTime'] = request.data['initialTimeFormatted']
                except:
                    request.data['pickUpTime'] = movement.pickUpTime
                try:
                    if request.data['finalTimeFormatted'] != "":
                        request.data['returnTime'] = request.data['finalTimeFormatted']
                except:
                    request.data['returnTime'] = movement.returnTime
                try:
                    request.data['intialDateMovement']
                except: 
                    request.data['intialDateMovement'] = movement.intialDateMovement
                try: 
                    request.data['finalDateMovement']
                except: 
                    request.data['finalDateMovement'] = movement.finalDateMovement
            except ObjectDoesNotExist:
                return Response({"serializer": "",
                                 "message": "valor(es) não existente(s) na base de dados"}, status=status.HTTP_400_BAD_REQUEST)
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
        # for updates in movements without a return
        try:
            if request.data['destinyScooterToAPI'] == "maintenance" or request.data['destinyScooterToAPI'] == "Manutenção":
                request.data['destinyScooter']  = "Manutenção"
            elif request.data['destinyScooterToAPI'] == "backup" or request.data['destinyScooterToAPI'] == "Backup":
                request.data['destinyScooter']  = "Backup"
            elif request.data['destinyScooterToAPI'] == "base" or request.data['destinyScooterToAPI'] == "Base":
                request.data['destinyScooter'] = "Base"
        except: pass
        request.data['typeMovement_id'] = movement.typeMovement_id
        request.data['base_id'] = movement.base_id
        serializer = MovementSerializer(movement, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"serializer": serializer.data,
                             "message": "movimentação atualizada com sucesso"}, status=status.HTTP_200_OK)
        return Response({"serializer": serializer.errors,
                         "message": "Erro ao atualizar dados"}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        if Movement.objects.get(id=pk).base_id == base_employee:
            permission_classes = [permissions.IsAuthenticated]
            if request.user.is_staff or request.user.is_superuser:
                serializer = MovementSerializer
                Movement.destroy(Movement, id=pk)
                return Response({"serializer": "",
                                "message": "movimentação excluída com sucesso"}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"serializer": "",
                                "message": "é necessário ser administrador para excluir um registro"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"serializer": "",
                             "message": "Não autorizado"}, status=status.HTTP_401_UNAUTHORIZED)
