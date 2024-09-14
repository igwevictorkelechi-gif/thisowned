from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view
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


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()

    def list(self, request, *args, **kwargs):
        token = request.query_params.get('token', None)
        if not self.request.user.is_authenticated and not token:
            return Response(
                {"detail": "Unauthorized: Invalid or missing (access or cart) token."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        token_carts = Cart.objects.filter(token=token)
        if self.request.user and self.request.user.is_authenticated:
            for cart in token_carts:
                if not cart.owner:
                    cart.owner = self.request.user
                    cart.token = ''
                    cart.save()
            cart_data = Cart.objects.filter(owner=self.request.user)
        else:
            cart_data = token_carts
        serializer = self.get_serializer(cart_data, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        token = request.query_params.get('token', None)
        if not request.user.is_authenticated and not token:
            return Response(
                {"detail": "Unauthorized: User must be authenticated or pass a 'token' params in url"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().create(request, *args, **kwargs)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        from .payment_gateway import pay_with_card
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = request.data

        # Save the new product using the serializer
        # self.perform_create(serializer)

        if data["payment_detail.method"] == "credit_card":
            payload = {
                "cardno": data["card_details.card_number"],
                "cvv": data["card_details.security_code"],
                "expirymonth": data["card_details.expiration_month"],
                "expiryyear": data["card_details.expiration_year"],
                "amount": str(data["payment_detail.amount"]),
                "email": request.user.email,
                "phonenumber": "0902620185",
                "firstname": data["card_details.first_name"],
                "lastname": data["card_details.last_name"],
            }

            print(payload)

            address = {
                "billingzip": data["billing_address.postal_code"], "billingcity": data["billing_address.city"],
                "billingaddress": data['billing_address.address'],"billingstate": data["billing_address.state"],
                "billingcountry": data["billing_address.country"]
            } if data["billing_address.address"] else {
                "billingzip": data["shipping_address.postal_code"], "billingcity": data["shipping_address.city"],
                "billingaddress": data['shipping_address.address'], "billingstate": data["shipping_address.state"],
                "billingcountry": data["shipping_address.country"]
            }

            res = pay_with_card(payload, address=address)
            print(res)

            return Response(res, status=status.HTTP_201_CREATED)


class CardAuthenticationViewSet(viewsets.ModelViewSet):
    queryset = None
    serializer_class = CardPinOrOTPSerializer
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        from .payment_gateway import auth_card

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = auth_card(**serializer.data)
        return Response(res, status=status.HTTP_200_OK)


class CardValidationViewSet(viewsets.ModelViewSet):
    queryset = None
    serializer_class = CardValidationSerializer
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        from .payment_gateway import validate_card
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = validate_card(**serializer.data)
        return Response(res, status=status.HTTP_200_OK)
