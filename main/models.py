from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from shortuuidfield import ShortUUIDField


class UserManager(BaseUserManager):
    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    email = models.EmailField(unique=True)
    # phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_online = models.BooleanField(default=False)
    # profile_picture = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.png')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    # def delete(self, using=None, keep_parents=False):
    #     # assuming that you use same storage for all files in this model:
    #     storage = self.profile_picture.storage
    #
    #     if storage.exists(self.profile_picture.name):
    #         storage.delete(self.profile_picture.name)
    #
    #     super().delete()


class Collection(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name='products')
    price = models.FloatField()
    ng_price = models.IntegerField(default=0)
    currency = models.CharField(max_length=20)
    discount = models.FloatField(null=True, blank=True)
    details = models.TextField()
    care = models.TextField()
    delivery_and_return = models.TextField()
    tags = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_image")
    image = models.ImageField(upload_to="products")


class ProductSet(models.Model):
    products = models.ManyToManyField(Product, related_name="sets")

    def __str__(self):
        return f"{[x.name for x in self.products.all()]}"


class SizeGuid(models.Model):
    products = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sizes")
    rating = models.CharField(max_length=20)
    labels = models.TextField()
    values = models.TextField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.products.name} size guide for {self.rating}"


class Cart(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart", blank=True, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart")
    quantity = models.IntegerField()
    size = models.ForeignKey(SizeGuid, on_delete=models.CASCADE, related_name='cart_size')
    is_complete_set = models.BooleanField(default=False)
    token = models.CharField(max_length=200, blank=True, null=True)


class Payment(models.Model):
    tx_ref = ShortUUIDField()
    method = models.CharField(max_length=50, choices=[
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer')
    ], default='credit_card')
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending')
    payload = models.TextField(null=True, blank=True)

    def __str__(self):
        order = self.order.first()
        return f"Payment for Order {order.pk}" if order else f"Payment (No Order) - {self.status}"


class Shipping(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    shipped_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        order = self.order.first()
        return f"Shipping for Order {order.pk}" if order else "Shipping (No Order)"


class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)
    delivery_time = models.CharField(max_length=100)
    rate_multiplier = models.DecimalField(max_digits=10, decimal_places=2)
    free_shipping_threshold = models.IntegerField(blank=True, null=True)
    country_exceptions = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.delivery_time})"

    def country_included(self, name):
        return name not in self.country_exceptions

    class Meta:
        ordering = ['name']


class ShippingRate(models.Model):
    country = models.CharField(max_length=100)
    base_rate = models.DecimalField(max_digits=10, decimal_places=2)
    state_multiplier = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"Rate for {self.method.name} to {self.country} {self.state or ''}"

    def state_base_rate(self, state):
        multiplier = self.state_multiplier.get(state, 1)
        return float(self.base_rate) * multiplier

    class Meta:
        ordering = ['country']


class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=3, default='ngn')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ], default='pending')
    payment_detail = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='order')
    shipping_address = models.ForeignKey(Shipping, on_delete=models.CASCADE, related_name="order")
    shipping_method = models.ForeignKey(ShippingMethod, on_delete=models.PROTECT, related_name='order')

    def __str__(self):
        return f"Order {self.id} - {self.customer}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    # product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product = models.JSONField()
    quantity = models.PositiveIntegerField()
    size = models.ForeignKey(SizeGuid, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.product['name']} (x{self.quantity})"
