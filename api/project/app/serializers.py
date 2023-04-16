
from rest_framework import serializers
from .models import *

class UserRegSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['fio', 'email', 'password']

    def save(self, **kwargs):
        user = User(
            email = self.validated_data['email'],
            fio=self.validated_data['fio'],
            password = self.validated_data['password'],
        )

        user.save()
        return user
    
class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()


class ProductSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Product
        fields = '__all__'

class CartSeriazlier(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    products = ProductSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['products', 'user']

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    products = ProductSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'