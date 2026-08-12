from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'image_url', 'description', 'product_count')
        read_only_fields = ('id', 'slug', 'product_count')

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'category', 'category_name', 'category_slug', 'name', 'slug',
            'image_url', 'image_url_2', 'image_url_3', 'description',
            'price', 'discount_price', 'stock', 'rating', 'num_reviews',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'slug', 'rating', 'num_reviews', 'created_at', 'updated_at')
