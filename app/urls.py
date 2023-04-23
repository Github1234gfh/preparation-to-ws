from django.urls import path
from .views import *

urlpatterns = [
    path('signup', SignUp.as_view()),
    path('login', Login.as_view()),
    path('logout', Logout.as_view()),
    path('products', GetProducts.as_view()),
    path('product', ProductAddDeletePatch.as_view()),
    path('product/<int:pk>', ProductAddDeletePatch.as_view()),
    path('cart', CartView.as_view()),
    path('cart/<int:pk>', CartView.as_view()),
    path('order', OrderView.as_view())
]
