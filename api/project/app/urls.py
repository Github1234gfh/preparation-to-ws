from django.urls import path
from .views import *

urlpatterns = [
    path('signup', UserRegister.as_view()),
    path('login', UserLogin.as_view()),
    path('logout', UserLogout.as_view()),
    path('products', ProductView.as_view()),
    path('product', ProductView.as_view()),
    path('product/<int:pk>', ProductView.as_view()),
    path('cart', CartView.as_view()),
    path('cart/<int:pk>', CartView.as_view()),
    path('order', OrderView.as_view()),
]