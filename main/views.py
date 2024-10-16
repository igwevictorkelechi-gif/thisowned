import json

from django.http import JsonResponse
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
import pycountry

from .serializers import *
from .models import Product, User, Collection


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-id')
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
        response = {"name": "all", "products": ProductListSerializer(combined_list, many=True, allow_null=True,
                                                                     context={"request": request}).data}
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
    queryset = Cart.objects.all().order_by('-id')

    def list(self, request, *args, **kwargs):
        token = request.query_params.get('token', None)
        if not self.request.user.is_authenticated and not token:
            return Response(
                {"detail": "Unauthorized: Invalid or missing (access or cart) token."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        token_carts = Cart.objects.filter(token=token).order_by('-id')
        if self.request.user and self.request.user.is_authenticated:
            for cart in token_carts:
                if not cart.owner:
                    cart.owner = self.request.user
                    cart.token = ''
                    cart.save()
            cart_data = Cart.objects.filter(owner=self.request.user).order_by('-id')
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


class CheckoutViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = CheckoutSerializer

    def list(self, request, *args, **kwargs):
        return Response([], status=status.HTTP_200_OK)


@csrf_exempt
def flutterwave_webhook(request):
    if request.method == 'POST':
        payload = json.loads(request.body)
        event = payload.get('event')

        tx_ref = payload.get('txRef')
        amount = payload.get('amount')
        status_ = payload.get('status')

        print(payload)

        if status_ == 'successful':
            # Mark payment as completed in your database
            payment = Payment.objects.filter(tx_ref=tx_ref).first()
            print(payment)
            if payment:
                payment.status = 'completed'
                payment.payload = json.dumps(payload)
                payment.save()
                carts = Cart.objects.filter(owner=payment.order.first().customer)
                for cart in carts:
                    cart.delete()

            return JsonResponse({"status": "success"}, status=200)
        else:
            # Handle failed or pending payment
            return JsonResponse({"status": "failed"}, status=400)

    return JsonResponse({"status": "invalid request"}, status=400)


@csrf_exempt
def paypal_webhook(request):
    if request.method == 'POST':
        payload = json.loads(request.body)
        print(payload)
    return JsonResponse({"status": "success"}, status=200)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def list(self, request, *args, **kwargs):
        if not self.request.user.is_authenticated:
            return Response(
                {"detail": "Unauthorized: Invalid or missing access token."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        order = Order.objects.filter(customer=request.user).order_by('-id')
        serializer = self.get_serializer(order, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ShippingRateViewSet(viewsets.ModelViewSet):
    queryset = ShippingRate.objects.all()
    serializer_class = ShippingRateSerializer
    http_method_names = ['get']

    def list(self, request, *args, **kwargs):
        country = request.query_params.get('country', None)
        state = request.query_params.get('state', None)
        if not country and not state:
            countries = [rate.country for rate in self.queryset]
            response = {"status": "country", 'options': countries}
            return Response(response, status=status.HTTP_200_OK)
        elif country and not state:
            pyc = pycountry.countries.get(name=country)
            states = sorted([state.name for state in pycountry.subdivisions.get(country_code=pyc.alpha_2)])
            response = {"status": "state", 'options': states}
            return Response(response, status=status.HTTP_200_OK)
        else:

            shipping_rate = ShippingRate.objects.get(country=country)
            serializer = self.get_serializer(shipping_rate, many=False, context={'state': state, "request": request})

            return Response(serializer.data, status=status.HTTP_200_OK)
