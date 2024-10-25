import json

from django import template
from math import log10, floor
import pycountry
from main.models import ShippingRate

register = template.Library()

@register.filter
def round_significant(value, sig_figs):
    try:
        value = float(value)
    except (ValueError, TypeError):
        return value
    if value == 0:
        return 0
    return round(value, sig_figs - int(floor(log10(abs(value)))) - 1)

@register.filter
def json_decode(value):
    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return []

@register.filter
def get_item(lst, index):
    try:
        return lst[index]
    except (IndexError, TypeError):
        return ''

@register.filter
def zip_lists(a, b):
    """Custom filter to zip two lists together"""
    return zip(a, b)


@register.simple_tag
def available_countries(current=None):
    used = [item.country for item in ShippingRate.objects.all() if item.country != current]
    countries = [country.name for country in pycountry.countries if country.name not in used]
    return countries


@register.simple_tag
def all_countries():
    return [country.name for country in pycountry.countries]


@register.simple_tag
def all_state(country):
    pyc = pycountry.countries.get(name=country)
    return sorted([state.name for state in pycountry.subdivisions.get(country_code=pyc.alpha_2)])


@register.filter
def get_dict_item(dictionary, key):
    return dictionary.get(key, 1)

@register.filter
def multiply(value, arg):
    """Multiply value and arg."""
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError):
        return None


@register.filter(name='lc')
def lc(value):
    return value.lower()

