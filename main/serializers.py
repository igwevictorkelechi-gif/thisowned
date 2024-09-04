from rest_framework import serializers
from .models import Product, ProductImage, User


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(source="product_image", many=True)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", "available_size", "details", "care",
                  "delivery_and_return", "images"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')


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
