from abc import ABC

from rest_framework import serializers
from .models import Product, ProductImage, User, Collection, ProductSet, SizeGuid, Cart, Order, OrderItem, Payment, \
    Shipping
# from .payment_gateway import pay_with_card


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ProductListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", "images", 'size']

    def get_images(self, obj):
        all_images = obj.product_image.all()[:2]
        return ProductImageSerializer(all_images, many=True).data

    def get_size(self, obj):
        return [[size.id, size.rating] for size in obj.sizes.all()]


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
    complete_set = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", "details", "care",
                  "delivery_and_return", "images", "complete_set", "size_guide"]

    def get_complete_set(self, obj):
        products = obj.sets.all()
        return [] if products.count() == 0 else ProductSetSerializer(products, many=True).data if products[
            0].products.count() else []


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', "password")

    def create(self, validated_data):
        # Create the user with a hashed password
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user


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
            self.fields['product'] = ProductListSerializer()
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
    name = serializers.CharField(source='product.name', read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    size = serializers.CharField(source='size.rating', read_only=True)
    currency = serializers.CharField(source="product.currency", read_only=True)
    discount = serializers.CharField(source="product.discount", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["name", "image", 'quantity', 'size', "currency", "discount"]

    def get_image(self, obj):
        image = obj.product.product_image.all().first()
        return image.image.url



class PaymentDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = ["id", 'tx_ref', 'method', 'status', "payload"]


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipping
        fields = ['address', 'city', 'postal_code', "state", 'country']


class CardDetailSerializer(serializers.Serializer):
    card_number = serializers.CharField(max_length=50)
    expiration_month = serializers.CharField(max_length=2)
    expiration_year = serializers.CharField(max_length=4)
    security_code = serializers.CharField(max_length=3)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)


class CheckoutSerializer(serializers.ModelSerializer):

    payment_method = serializers.ChoiceField(choices=Payment.method.field.choices, write_only=True)
    shipping_address = ShippingAddressSerializer(write_only=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, default=0.00, source="total", read_only=True)
    tx_ref = serializers.CharField(max_length=1000, source="payment_detail.tx_ref", read_only=True)
    email = serializers.EmailField(source="customer.email")
    first_name = serializers.CharField(max_length=1000, source="customer.first_name", read_only=True)
    last_name = serializers.CharField(max_length=1000, source="customer.last_name", read_only=True)

    class Meta:
        model = Order
        fields = ["payment_method", 'shipping_address', "tx_ref", "amount", "email", "first_name", "last_name"]

    def create(self, validated_data):
        # Extract related data
        # payment_data = validated_data.pop('payment_detail')
        shipping_data = validated_data.pop('shipping_address')
        payment_method = validated_data.pop("payment_method")
        # card_details = validated_data.pop('card_details')
        # billing_address = validated_data.pop('billing_address')
        request = self.context.get('request')
        validated_data["customer"] = request.user

        # Step 1: Create the Payment
        payment = Payment.objects.create(method=payment_method)

        # Step 2: Create the Shipping
        shipping = Shipping.objects.create(**shipping_data)

        items_data = Cart.objects.filter(owner=request.user)

        # Step 3: Create the Order
        order = Order.objects.create(**validated_data, payment_detail=payment, shipping_address=shipping)

        # Step 4: Create Order Items and calculate total
        total = 0
        for item_data in items_data:
            OrderItem.objects.create(order=order, product=item_data.product, quantity=item_data.quantity,
                                     size=item_data.size)
            discount_price = ((item_data.product.discount if item_data.product.discount else 0)/100)
            total += (item_data.product.price - (item_data.product.price * discount_price)) * item_data.quantity

        order.total = total
        order.save()

        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    payment_detail = PaymentDetailsSerializer()
    shipping_address = ShippingAddressSerializer()

    class Meta:
        model = Order
        fields = "__all__"

