from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *
from .models import Product, User, Collection


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return super().get_serializer_class()



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


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CollectionDetailSerializer
        return super().get_serializer_class()


class AllCollectionsView(APIView):
    def get(self, request):
        query_sets = [x.products.all() for x in Collection.objects.all()]
        combined_list = [item for qs in query_sets for item in qs]
        response = {"name": "all", "products": ProductListSerializer(combined_list, many=True, allow_null=True).data}
        return Response(response, status=status.HTTP_200_OK)


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response_data = {
            'user': serializer.data,
            'access': access_token,
            'refresh': refresh_token
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


