from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)  # 1 to 5 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # Prevent users from submitting multiple reviews for the same product
        unique_together = ('product', 'user')

    def __str__(self):
        return f"{self.rating}* by {self.user.username} for {self.product.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_product_rating()

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        self.recalculate_product_rating(product)

    def update_product_rating(self):
        product = self.product
        reviews = product.reviews.all()
        product.num_reviews = reviews.count()
        if reviews.exists():
            product.rating = sum(r.rating for r in reviews) / reviews.count()
        else:
            product.rating = 0.0
        product.save()

    def recalculate_product_rating(self, product):
        reviews = product.reviews.all()
        product.num_reviews = reviews.count()
        if reviews.exists():
            product.rating = sum(r.rating for r in reviews) / reviews.count()
        else:
            product.rating = 0.0
        product.save()
