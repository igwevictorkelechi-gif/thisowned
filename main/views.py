from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ProductSerializer, UserSerializer, UserAdminSerializer
from .models import Product, User


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['get', 'put']

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk == 'current':
            return self.request.user
        return super().get_object()

    # def get_queryset(self):
        # Exclude the requesting user
        # return User.objects.exclude(id=self.request.user.id)


class UserAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserAdminSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk == 'current':
            return self.request.user
        return super().get_object()
