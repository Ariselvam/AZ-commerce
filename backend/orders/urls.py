from django.urls import path
from .views import OrderCreateListView, OrderDetailView, OrderStatusUpdateView, AdminStatsView

urlpatterns = [
    path('', OrderCreateListView.as_view(), name='order-list-create'),
    path('stats/', AdminStatsView.as_view(), name='order-stats'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
]
