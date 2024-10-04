from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('orders/', views.orders, name='orders'),
    path('collections/', views.collections, name='collections'),
    path('shipping/', views.shipping, name='shipping'),
    path('shipping/method/', views.shipping_method, name='shipping_method'),
    path('shipping/method/<str:method_id>', views.shipping_method, name='shipping_method_'),
    path('shipping/sm/<str:rate_id>', views.state_multi, name='state_multi_'),
    path('collections/<int:c_id>', views.collections, name='edit_collection'),
    path('customers/', views.customers, name='customers'),
    path('products/', views.products, name='products'),
    path('products/<int:p_id>', views.products, name='products'),
    path('products/form/', views.products_form, name='products_form'),
    path('products/form/<int:p_id>', views.products_form, name='products_form_update'),
]
