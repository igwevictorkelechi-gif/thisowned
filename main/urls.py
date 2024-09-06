from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='products')
router.register(r'users', views.UserViewSet, basename='users')
router.register(r'users_admin', views.UserAdminViewSet, basename='users_admin')
router.register(r'collection', views.CollectionViewSet, basename='collection')
router.register(r'register', views.RegisterViewSet, basename='register')

urlpatterns = [
    path('collection/all/', views.AllCollectionsView.as_view(), name="all_collection"),
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]