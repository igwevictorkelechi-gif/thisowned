from django.core.cache import cache
from rest_framework import serializers
import requests
from .models import Product, ProductImage, User, Collection, ProductSet, SizeGuid, Cart, Order, OrderItem, Payment, \
    Shipping, ShippingRate, ShippingMethod


def price_converter(source_currency, target_currency):
    cached = cache.get(f'{source_currency}-{target_currency}', None)
    if cached:
        return cached
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{source_currency}{target_currency}=X"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
    data = requests.get(url, headers=headers).json()
    rate = data["chart"]["result"][0]["meta"]["regularMarketPrice"]
    result = 1 * float(rate)
    cache.set(f'{source_currency}-{target_currency}', result, timeout=60 * 24)

    return result


currency_dict = {
    "USD": "$",  # United States Dollar
    "EUR": "€",  # Euro
    "GBP": "£",  # British Pound Sterling
    "INR": "₹",  # Indian Rupee
    "NGN": "₦"
}

counties_currency = {
    "United States, Puerto Rico, Guam, Northern Mariana Islands, American Samoa, U.S. Virgin Islands": "USD",
    # United States Dollar
    """Austria, Belgium, Cyprus, Estonia, Finland, France, Germany, Greece, Ireland, Italy, Latvia, Lithuania, 
    Luxembourg, Malta, Netherlands, Portugal, Slovakia, Slovenia, Spain, Andorra, Monaco, San Marino, Vatican City, 
    Kosovo, Montenegro""": "EUR",  # Euro
    "United Kingdom, England, Scotland, Wales, Northern Ireland": "GBP",  # British Pound Sterling
    "India, Bhutan": "INR",  # Indian Rupee
    "Nigeria": "NGN",  # Nigerian Naira
}


def get_currency_by_country(user_country):
    for countries, currency in counties_currency.items():
        if user_country in countries.split(", "):
            return currency
    return "USD"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ProductListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    discount_price = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", 'discount_price', "images", 'size', 'in_stock']

    def get_images(self, obj):
        all_images = obj.product_image.all()[:2]
        return ProductImageSerializer(all_images, many=True).data

    def get_size(self, obj):
        return [[size.id, size.rating] for size in obj.sizes.all()]

    def get_price(self, obj):
        request = self.context.get('request')
        return obj.final_price(request.user, price_converter)

    def get_discount_price(self, obj):
        price = obj.final_price(self.context.get('request').user, price_converter)
        return price - (price * ((obj.discount if obj.discount else 0) / 100))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.method == "GET":
            target_currency = request.query_params.get('code', data['currency'])
            if target_currency and target_currency.upper() != data['currency'].upper():
                pass
                base_price = price_converter(data['currency'].upper(), target_currency.upper())
                data['price'], data['currency'] = round((data['price'] * base_price), 2), target_currency.lower()
                data["discount_price"] = round((data["discount_price"] * base_price), 2)
            data["symbol"] = currency_dict.get(target_currency.upper(), data['currency'].upper())
        return data


class ProductSetSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = ProductSet
        fields = ['id', 'products']


class SizeGuidSerializer(serializers.ModelSerializer):
    class Meta:
        model = SizeGuid
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(source="product_image", many=True, allow_null=True)
    size_guide = SizeGuidSerializer(source="sizes", many=True, allow_null=True)
    price = serializers.SerializerMethodField()
    discount_price = serializers.SerializerMethodField()
    complete_set = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", "discount_price", "details", "care",
                  "delivery_and_return", "images", "complete_set", "size_guide", 'in_stock']

    def get_complete_set(self, obj):
        products = obj.sets.all()
        request = self.context.get('request')
        return [] if products.count() == 0 else ProductSetSerializer(
            products, many=True, context={'request': request}).data if products[0].products.count() else []

    def get_price(self, obj):
        request = self.context.get('request')
        return obj.final_price(request.user, price_converter)

    def get_discount_price(self, obj):
        price = obj.final_price(self.context.get('request').user, price_converter)
        return price - (price * ((obj.discount if obj.discount else 0) / 100))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.method == "GET":
            target_currency = request.query_params.get('code', data['currency'])
            if target_currency and target_currency.upper() != data['currency'].upper():
                pass
                base_price = price_converter(data['currency'].upper(), target_currency.upper())
                data['price'], data['currency'] = round((data['price'] * base_price), 2), target_currency.lower()
                data["discount_price"] = round((data["discount_price"] * base_price), 2)
            data["symbol"] = currency_dict.get(target_currency.upper(), data['currency'].upper())
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    currency = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'country', 'currency', "password")

    def create(self, validated_data):
        # Create the user with a hashed password
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            country=validated_data['country'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    def get_currency(self, obj):
        return get_currency_by_country(obj.country)


class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["is_active", "is_staff", "date_joined", "last_login", 'groups', 'user_permissions']


class UserAdminSerializer(serializers.ModelSerializer):
    personal = UserSerializer(source='*')
    admin = UserTypeSerializer(source='*')

    class Meta:
        model = User
        fields = ['personal', 'admin']


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = "__all__"


class CollectionDetailSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ['id', 'name', 'products']


class CartSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "product", "size", "quantity"]

    def __init__(self, *args, **kwargs):
        request = kwargs.get('context', {}).get('request')
        super().__init__(*args, **kwargs)

        if request and request.method == 'GET':
            self.fields['product'] = ProductListSerializer(context={'request': request})
            self.fields['size'] = SizeGuidSerializer()
        elif request and request.method == 'POST':
            self.fields['product'] = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
            self.fields['size'] = serializers.PrimaryKeyRelatedField(queryset=SizeGuid.objects.all())

    def get_product(self, obj):
        serializer = ProductListSerializer(obj.product)
        return serializer.data

    def get_size(self, obj):
        serializer = SizeGuidSerializer(obj.size)
        return serializer.data

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data["token"] = request.query_params.get('token', '')
        if request and request.user and request.user.is_authenticated:
            validated_data["owner"] = request.user
            validated_data['token'] = ''
        return super().create(validated_data)


class OrderItemProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name"]


class OrderItemSerializer(serializers.ModelSerializer):
    size = serializers.CharField(source='size.rating', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'size', 'quantity']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.method == "GET":
            target_currency = request.query_params.get('code', data['product']["currency"])
            if target_currency and target_currency.upper() != data['product']["currency"].upper():
                base_price = price_converter(data['product']['currency'].upper(), target_currency.upper())
                data['product']['price'] = round((base_price * data['product']['price']), 2)
                data['product']['currency'] = target_currency.lower()
            data["product"]["symbol"] = currency_dict.get(target_currency.upper(), data['product']["currency"].upper())
        return data


class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", 'tx_ref', 'method', 'status', "payload"]


class ShippingAddressSerializer(serializers.ModelSerializer):
    shipped_at = serializers.DateField(read_only=True)

    class Meta:
        model = Shipping
        fields = '__all__'


class CardDetailSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=50)
    expiration_month = serializers.CharField(max_length=2)
    expiration_year = serializers.CharField(max_length=4)
    security_code = serializers.CharField(max_length=3)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)


class CheckoutSerializer(serializers.ModelSerializer):
    shipping_address = ShippingAddressSerializer(write_only=True)
    shipping_method = serializers.PrimaryKeyRelatedField(queryset=ShippingMethod.objects.all(), write_only=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00, source="total", read_only=True)
    currency = serializers.CharField(max_length=3, read_only=True)
    tx_ref = serializers.CharField(max_length=1000, source="payment_detail.tx_ref", read_only=True)
    email = serializers.EmailField(source="shipping_address.email", read_only=True)
    first_name = serializers.CharField(max_length=1000, source="customer.first_name", read_only=True)
    last_name = serializers.CharField(max_length=1000, source="customer.last_name", read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'shipping_address', 'shipping_method', "tx_ref", "amount", "currency",
                  "email", "first_name", "last_name"]

    def create(self, validated_data):
        # Extract related data
        # payment_data = validated_data.pop('payment_detail')
        shipping_data = validated_data.pop('shipping_address')
        # payment_method = validated_data.pop("payment_method")
        # card_details = validated_data.pop('card_details')
        # billing_address = validated_data.pop('billing_address')
        request = self.context.get('request')
        validated_data["customer"] = request.user
        target_currency = request.query_params.get('code', 'NGN').upper()

        # Step 1: Create the Payment
        payment = Payment.objects.create()

        # Step 2: Create the Shipping
        shipping = Shipping.objects.create(**shipping_data)

        items_data = Cart.objects.filter(owner=request.user)

        # Step 3: Create the Order
        order = Order.objects.create(**validated_data, payment_detail=payment, shipping_address=shipping)

        # Step 4: Create Order Items and calculate total
        total = 0
        for item_data in items_data:
            discount_price = ((item_data.product.discount if item_data.product.discount else 0) / 100)
            price = item_data.product.final_price(self.context.get('request').user, price_converter)
            new_price = (price - (price * discount_price)) * item_data.quantity

            item_dict = {"name": item_data.product.name, "image": item_data.product.product_image.first().image.url,
                         "currency": item_data.product.currency, "price": new_price, 'id': item_data.product.id}

            OrderItem.objects.create(order=order, product=item_dict, quantity=item_data.quantity,
                                     size=item_data.size)
            source_currency = item_data.product.currency.upper()

            total += new_price if source_currency == target_currency else \
                (price_converter(source_currency, target_currency) * new_price)

        shipping_rate = ShippingRate.objects.get(country=shipping.country)
        shipping_price = float(shipping_rate.state_base_rate(shipping.state) * order.shipping_method.rate_multiplier)
        total += shipping_price if target_currency == 'NGN' else \
            (price_converter('NGN', target_currency) * shipping_price)

        order.total = total
        order.currency = target_currency.lower()
        order.save()
        return order

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        source_currency = data["currency"].upper()
        if 'USD' != source_currency:
            base_price = price_converter(source_currency, 'USD')
            data['amount_usd'] = str(base_price * float(data['amount']))
        else:
            data['amount_usd'] = data['amount']
        if "NGN" != source_currency:
            base_price = price_converter(source_currency, 'NGN')
            data['amount_ngn'] = str(base_price * float(data['amount']))
        else:
            data['amount_ngn'] = data['amount']
        return data


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    payment_detail = PaymentDetailsSerializer()
    shipping_address = ShippingAddressSerializer()

    class Meta:
        model = Order
        fields = "__all__"


class ShippingMethodSerializer(serializers.ModelSerializer):
    shipping_price = serializers.SerializerMethodField()

    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'delivery_time', 'shipping_price']

    def get_shipping_price(self, obj):
        return self.context.get('state_base_rate', None) * float(obj.rate_multiplier)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        target_currency = request.query_params.get('code', None)
        if target_currency and target_currency.upper() != 'NGN':
            data['shipping_price'] = price_converter('NGN', target_currency.upper()) * data["shipping_price"]
        data["symbol"] = currency_dict[target_currency.upper() if target_currency else 'NGN']
        data['currency'] = target_currency.upper() if target_currency else 'NGN'
        return data


class ShippingRateSerializer(serializers.ModelSerializer):
    method = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()

    class Meta:
        model = ShippingRate
        fields = ["method", "country", "state"]

    def get_method(self, obj):
        all_methods = ShippingMethod.objects.all()
        methods = []
        for method in all_methods:
            if method.country_included(obj.country):
                methods.append(method)
        state_base_rate = obj.state_base_rate(self.context.get('state', None))
        return ShippingMethodSerializer(methods, many=True, context={
            "state_base_rate": state_base_rate, 'request': self.context.get('request')}).data

    def get_state(self, obj):
        return self.context.get('state', None)
