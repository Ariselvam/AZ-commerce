from rest_framework import generics, permissions, serializers
from .models import Review
from .serializers import ReviewSerializer
from products.models import Product

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'])

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError({"detail": "Product not found."})

        # Check if the user has already reviewed this product
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise serializers.ValidationError({"detail": "You have already reviewed this product."})

        serializer.save(user=self.request.user, product=product)
