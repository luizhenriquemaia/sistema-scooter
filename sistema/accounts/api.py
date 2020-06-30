from knox.models import AuthToken
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response

from main.models import BaseOfWork

from .serializers import BaseOfWorkSerializer, LoginSerializer, UserSerializer


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
