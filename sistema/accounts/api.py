from django.contrib.auth.models import User
from knox.models import AuthToken
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from main.models import Employee

from .serializers import EmployeeSerializer, LoginSerializer, UserSerializer


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token = AuthToken.objects.create(user)[1]
        return Response({
            "user": UserSerializer(user, 
            context=self.get_serializer_context()).data,
            "token": token
        })


# get the token and retrieve the user
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user



class EmployeeViewSet(viewsets.ViewSet):
    permissions_classes = [permissions.IsAdminUser]

    def list(self, request):
        base_employee = Employee.objects.get(
            user_id=request.user.id).base_id
        if request.user.is_staff:
            queryset = Employee.objects.filter(base_id=base_employee)
            serializer = EmployeeSerializer(queryset, many=True)
            if len(serializer.data) > 0:
                return Response({"serializer": serializer.data,
                                 "message": ""}, status=status.HTTP_200_OK)
            else:
                return Response({"serializer": serializer.data,
                                 "message": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        if request.user.is_staff:
            try:
                # if user already exists
                id_user_in_db = User.objects.get(
                    username=request.data['name']).id
                # if employee already exists
                try:
                    employee_in_db = Employee.objects.get(
                        user_id=id_user_in_db)
                    return Response({"serializer": "",
                                     "message": "Usuário já cadastrado"}, status=status.HTTP_400_BAD_REQUEST)
                # if user exists but employee not try to add employee
                except ObjectDoesNotExist:
                    data_for_create_employee = {
                        'user_id': id_user_in_db,
                        'base_id': 1
                    }
                    serializer_employee = EmployeeSerializer(
                        data=data_for_create_employee)
                    if serializer_employee.is_valid(raise_exception=True):
                        new_employee = serializer_employee.save()
                        return Response({"serializer": serializer_employee.data,
                                         "message": "Colaborador adicionado com sucesso"}, status=status.HTTP_201_CREATED)
                    return Response({"serializer": serializer_employee.errors,
                                     "message": "Erro ao criar colaborador"}, status=status.HTTP_400_BAD_REQUEST)
            except ObjectDoesNotExist:
                # create a user
                try:
                    request.data['email']
                except:
                    request.data['email'] = ""
                ## When users frontend gets created, change is_staff for request.data['isAdmin']
                data_for_create_user = {
                    'username': request.data['name'],
                    'email': request.data['email'],
                    'password': request.data['password'],
                    'is_staff': True
                }
                serializer_user = UserSerializer(data=data_for_create_user)
                if serializer_user.is_valid(raise_exception=True):
                    new_user = serializer_user.save()
                else:
                    return Response({"serializer": serializer_user.errors,
                                     "message": "Erro ao criar usuário"}, status=status.HTTP_400_BAD_REQUEST)
                # create a employee
                data_for_create_employee = {
                    'user_id': new_user.id,
                    'base_id': 1
                }
                serializer_employee = EmployeeSerializer(
                    data=data_for_create_employee)
                if serializer_employee.is_valid(raise_exception=True):
                    new_employee = serializer_employee.save()
                    return Response({"serializer": serializer_employee.data,
                                     "message": "Colaborador adicionado com sucesso"}, status=status.HTTP_201_CREATED)
                return Response({"serializer": serializer_employee.errors,
                                 "message": "Erro ao criar colaborador"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"serializer": "",
                             "message": "Para realizar esta ação é necessária uma conta adm"}, status=status.HTTP_401_UNAUTHORIZED)
