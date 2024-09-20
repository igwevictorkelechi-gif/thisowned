import json

from django import template
from math import log10, floor

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
