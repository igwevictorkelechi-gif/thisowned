from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import ProductImage


@receiver(pre_delete, sender=ProductImage)
def delete_product_image_file(sender, instance, **kwargs):
    """
    Deletes the image file from storage when a ProductImage instance is deleted.
    """
    if instance.image:
        instance.image.delete(save=False)
