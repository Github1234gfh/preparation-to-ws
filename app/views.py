from rest_framework.views import APIView
from django.http import JsonResponse
from .serializers import *
from .models import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import *
from .permitions import *

class SignUp(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = Token.objects.create(user=user)
            return JsonResponse({
                'data': {
                    'user_token': token.key
                }
            }, status=201)

class Login(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data
            if not user:
                return JsonResponse({'error': {'code': 401, 'message': 'Authentication failed'}}, status=401)
            token_object, token_created = Token.objects.get_or_create(user=user)
            token = token_object or token_created
            return JsonResponse({'data': {'user_token': token.key}}, status=201)

class Logout(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        request.user.auth_token.delete()
        return JsonResponse({'data': {'message': 'logout'}}, status=200)

class GetProducts(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return JsonResponse({'data': serializer.data}, status=200)

class ProductAddDeletePatch(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse({"data": {"id": serializer.data['id'], "message": 'Product added'}}, status=201)

    def patch(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        product = Product.objects.get(pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse({"data": serializer.data})

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        product = Product.objects.get(pk=pk)
        product.delete()

        return JsonResponse({"data": {"message": "Product removed"}})

class CartView(APIView):
    permission_classes = [NotAdminPermition, IsAuthenticated, ]

    def get(self, request):
        cart, create = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, many=False)

        return JsonResponse({"data": serializer.data['products']}, status=200)

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        product = Product.objects.get(pk=pk)
        cart, create = Cart.objects.get_or_create(user=request.user)
        cart.products.add(product)
        return JsonResponse({'data': {'message': "Product add to card"}}, status=201)

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        product = Product.objects.get(pk=pk)
        cart = Cart.objects.get(user=request.user)
        cart.products.remove(product)

        return JsonResponse({"data": {"message": "Item removed from cart"}}, status=200)

class OrderView(APIView):
    permission_classes = [NotAdminPermition, IsAuthenticated, ]

    def get(self, request):
        order = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(order, many=True)

        return JsonResponse({'data': serializer.data}, status=200)

    def post(self, request):
        cart = Cart.objects.get(user=request.user)

        if len(cart.products.all()) == 0:
            return JsonResponse({'error': {'code': 422,'message': 'Cart is empty'}}, status=422)
        order = Order.objects.create(user=request.user)
        total_price = 0
        for product in cart.products.all():
            order.products.add(product)
            total_price += product.price
            cart.products.remove(product)
        order.order_price = total_price
        order.save()

        return JsonResponse({"data": {'order_id': order.id,"message": 'Order is processed'}}, status=201)