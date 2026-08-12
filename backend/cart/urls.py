from django.urls import path
from .views import CartDetailView, AddCartItemView, UpdateCartItemView, ClearCartView

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart-detail'),
    path('add/', AddCartItemView.as_view(), name='cart-add'),
    path('item/<int:item_id>/', UpdateCartItemView.as_view(), name='cart-item-update'),
    path('clear/', ClearCartView.as_view(), name='cart-clear'),
]
