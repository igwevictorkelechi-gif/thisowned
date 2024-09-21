import json

from django.shortcuts import render, redirect, get_object_or_404
from django.http.response import JsonResponse
from django.contrib.auth.decorators import user_passes_test
from django.forms import ValidationError
from django.contrib.auth import views as auth_views, authenticate, login
from .forms import CustomAuthenticationForm, CollectionForm
from main.models import Order, Collection, User, Product, ProductImage, SizeGuid


# Custom test function to check if user is an admin
def admin_check(user):
    return user.is_staff


class CustomLoginView(auth_views.LoginView):
    template_name = 'login.html'
    authentication_form = CustomAuthenticationForm

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(request.GET.get('next', '/dashboard/'))
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        user = authenticate(self.request, username=form.cleaned_data['username'],
                            password=form.cleaned_data['password'])
        if user is not None and user.is_staff:
            login(self.request, user)
            return redirect(self.request.GET.get('next', '/dashboard/'))
        else:
            form.add_error(None, ValidationError("Only staff members can log in."))
            return self.form_invalid(form)

    def form_invalid(self, form):
        return super().form_invalid(form)


@user_passes_test(admin_check, login_url='login/')
def dashboard(request):
    pending = Order.objects.filter(status="pending").count()
    total_s = 0
    revenue = 0
    for item in Order.objects.filter(status="completed"):
        revenue += item.total
        total_s += item.items.all().count()

    return render(request, 'dashboard.html', {'pending': pending, 'total_s': total_s, 'revenue': revenue})


def orders(request):
    all_orders = Order.objects.all()
    return render(request, 'orders.html', {'orders': all_orders})


def collections(request, c_id=None):
    all_collections = Collection.objects.all().order_by('-id')
    if request.method == 'POST':
        if c_id:
            collection = get_object_or_404(Collection, pk=c_id)
            form = CollectionForm(request.POST, instance=collection)
        else:
            form = CollectionForm(request.POST)
        if form.is_valid():
            form.save()
        return redirect('collections')
    elif request.method == 'DELETE':
        collection = get_object_or_404(Collection, pk=c_id)
        collection.delete()
        return JsonResponse({'response': 'done'})
    if c_id:
        col = get_object_or_404(Collection, pk=c_id)
        return render(request, 'collections.html', {'collections': all_collections, 'col': col})
    return render(request, 'collections.html', {'collections': all_collections})


def customers(request):
    all_customers = User.objects.exclude(is_staff=True).order_by('-id')
    return render(request, 'customers.html', {'customers': all_customers})


def products(request, p_id=None):
    if p_id and request.method == 'DELETE':
        product = get_object_or_404(Product, id=p_id)
        product.delete()
        return JsonResponse({'status': 'done'})
    all_products = Product.objects.all()
    return render(request, 'products.html', {'products': all_products})


def products_form(request, p_id=None):
    if request.method == 'POST':
        p, f = request.POST, request.FILES
        collection = Collection.objects.get(id=p.get('collection'))
        ap = Product() if not p.get('product_id') else Product.objects.get(id=p.get('product_id'))
        ap.name, ap.collection, ap.price, ap.care = p.get('name'), collection, p.get('b-price'), p.get('care')
        ap.currency, ap.discount, ap.details = p.get('price-currency'), p.get('discount'), p.get('details')
        ap.tags = p.get('tags')

        if p.get('product_id'):
            for item in ProductImage.objects.filter(image__in=json.loads(p.get('removed'))):
                item.delete()
            for item in ap.sizes.all():
                item.delete()
        ap.save()
        for image in f.getlist('images'):
            ProductImage.objects.create(image=image, product=ap)
        rating = p.get('rating').split(',')
        for i, item in enumerate(rating):
            SizeGuid.objects.create(rating=item, labels=json.dumps(p.getlist('label')),
                                    values=json.dumps(p.getlist(item)), products=ap)
        return redirect('products')

    collection = Collection.objects.all().order_by('name')

    if p_id:
        product = Product.objects.get(id=p_id)
        return render(request, 'product_form.html', {'collection': collection, 'product': product})

    return render(request, 'product_form.html', {'collection': collection})
