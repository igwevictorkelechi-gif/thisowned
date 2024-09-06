from rest_framework import serializers
from .models import Product, ProductImage, User, Collection, ProductSet, SizeGuid


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ProductListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "price", "currency", "discount", "images"]

    def get_images(self, obj):
        all_images = obj.product_image.all()
        if all_images:
            return ProductImageSerializer([all_images.first()], many=True).data
        return None


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
        fields = ["id", "name", "price", "currency", "discount", "available_size", "details", "care",
                  "delivery_and_return", "images", "complete_set", "size_guide"]

    def get_complete_set(self, obj):
        products = obj.sets.all()
        return [] if products.count() == 0 else ProductSetSerializer(products, many=True).data if products[
            0].products.count() else []


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


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = "__all__"


class CollectionDetailSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Collection
        fields = ['id', 'name', 'products']
