from django.contrib import admin
from .models import User, Product, ProductImage
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model


class CustomUserAdmin(UserAdmin):
    """Define admin model for custom User model with no username field."""
    model = User
    fieldsets = (
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (None, {'fields': ('email', 'password', 'is_online')}),
        # (_('Social links'), {'fields': ('facebook', 'twitter', 'linkedin', 'whatsapp')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email' 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('first_name',)


admin.site.register(get_user_model(), CustomUserAdmin)


admin.site.register(Product)
admin.site.register(ProductImage)


