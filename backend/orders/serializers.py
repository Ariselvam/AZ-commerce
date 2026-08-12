from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from cart.models import Cart
import decimal

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    item_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_details', 'product_name', 'price', 'quantity', 'item_total')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'username', 'user_email', 'full_name', 'email', 'phone',
            'address', 'city', 'state', 'pincode', 'status',
            'total_amount', 'delivery_charge', 'payment_method', 'is_paid',
            'created_at', 'updated_at', 'items'
        )
        read_only_fields = ('id', 'user', 'status', 'total_amount', 'delivery_charge', 'is_paid', 'created_at', 'updated_at')

    def create(self, validated_data):
        user = self.context['request'].user
        
        # Fetch cart
        try:
            cart = user.cart
        except Exception:
            raise serializers.ValidationError({"detail": "User does not have an active shopping cart."})

        cart_items = cart.items.all()
        if not cart_items.exists():
            raise serializers.ValidationError({"detail": "Cannot place an order. Your shopping cart is empty."})

        # Calculate totals
        subtotal = sum(item.item_total for item in cart_items)
        # Apply standard delivery charge (e.g. Free shipping above ₹500, else ₹40)
        delivery_charge = decimal.Decimal('0.00') if subtotal >= decimal.Decimal('500.00') else decimal.Decimal('40.00')
        total_amount = subtotal + delivery_charge

        # Create the order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            delivery_charge=delivery_charge,
            **validated_data
        )

        # Create order items & deduct product stock
        for item in cart_items:
            product = item.product
            if product.stock < item.quantity:
                raise serializers.ValidationError({
                    "detail": f"Insufficient stock for product '{product.name}'. Available: {product.stock}, Requested: {item.quantity}."
                })
            
            # Deduct stock
            product.stock -= item.quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=product.active_price,
                quantity=item.quantity
            )

        # Wipe cart items
        cart_items.delete()
        
        return order
