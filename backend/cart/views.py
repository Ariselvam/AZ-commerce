from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product

class CartDetailView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class AddCartItemView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

        if not product_id:
            return Response({"error": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        if product.stock <= 0:
            return Response({"error": "Product is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        if cart_item.quantity > product.stock:
            cart_item.quantity = product.stock
            cart_item.save()
            return Response({
                "warning": f"Quantity capped at available stock ({product.stock}).",
                "cart": CartSerializer(cart).data
            }, status=status.HTTP_200_OK)

        cart_item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateCartItemView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Invalid quantity."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            cart_item.delete()
        else:
            if quantity > cart_item.product.stock:
                return Response({"error": f"Only {cart_item.product.stock} items left in stock."}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save()

        cart = cart_item.cart if quantity > 0 else Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Cart item not found."}, status=status.HTTP_404_NOT_FOUND)

        cart = cart_item.cart
        cart_item.delete()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class ClearCartView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
