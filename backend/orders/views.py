from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.db.models import Sum
from .models import Order
from .serializers import OrderSerializer
from products.models import Product
from django.contrib.auth import get_user_model

User = get_user_model()

class OrderCreateListView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        # Staff and admins see all orders; customers see only theirs
        if user.is_staff or user.is_admin_user:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()

class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_admin_user:
            return Order.objects.all()
        return Order.objects.filter(user=user)

class OrderStatusUpdateView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        status_val = request.data.get('status')
        if not status_val:
            return Response({"error": "Status value is required."}, status=status.HTTP_400_BAD_REQUEST)

        valid_statuses = [c[0] for c in Order.STATUS_CHOICES]
        if status_val not in valid_statuses:
            return Response({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_val
        if status_val == 'Delivered':
            order.is_paid = True
        elif status_val == 'Cancelled':
            # Optionally return stock to product
            for item in order.items.all():
                if item.product:
                    item.product.stock += item.quantity
                    item.product.save()

        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

class AdminStatsView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        total_products = Product.objects.count()
        total_users = User.objects.filter(is_superuser=False).count()
        total_orders = Order.objects.count()
        
        # Calculate revenue of non-cancelled orders
        revenue_sum = Order.objects.exclude(status='Cancelled').aggregate(Sum('total_amount'))
        total_revenue = revenue_sum['total_amount__sum'] or 0.00

        # Fetch basic list of recent orders (latest 5)
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        recent_orders_data = OrderSerializer(recent_orders, many=True).data

        return Response({
            "stats": {
                "total_products": total_products,
                "total_users": total_users,
                "total_orders": total_orders,
                "total_revenue": float(total_revenue),
            },
            "recent_orders": recent_orders_data
        }, status=status.HTTP_200_OK)
