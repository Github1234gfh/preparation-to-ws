from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework.authtoken.models import Token
from rest_framework.permissions import *
from .permitions import *
from rest_framework import status
from django.forms.models import model_to_dict

class UserRegister(APIView):
    def post(self, request):
        serializer = UserRegSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"data": {"user_token": Token.objects.create(user=user).key}},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "error": {
                    "code": 422,
                    "message": "Validation errors",
                    "errors": serializer.errors,
                }
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class UserLogin(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data["email"])
            except:
                return Response(
                    {"error": {"code": 401, "message": "Authentication failed"}},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"body": {"user_token": token.key}}, status=status.HTTP_200_OK
            )
        return Response(
            {
                "error": {
                    "code": 422,
                    "message": "Нарушение правил валидации",
                    "errors": serializer.errors,
                }
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )


class UserLogout(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        request.user.auth_token.delete()
        return Response({"body": {"message": "logout"}})


class ProductView(APIView):
    permission_classes = [
        MyPermition,
    ]

    def get(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        if pk:
            try:
                product = Product.objects.get(pk=pk)
            except:
                return Response(
                    {"error": {"code": 404, "error": "Not found"}},
                    status=status.HTTP_404_NOT_FOUND,
                )
            serializer = ProductSerializer(product, many=False)
            return Response({"data": serializer.data})

        produts = Product.objects.all()
        serializer = ProductSerializer(produts, many=True)
        return Response({"body": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            return Response(
                {"body": {"id": data["id"], "message": "Product added"}},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "error": {
                    "code": 422,
                    "message": "Нарушение правил валидации",
                    "errors": serializer.errors,
                }
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def patch(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        try:
            object = Product.objects.get(pk=pk)
        except:
            return Response(
                {"error": {"code": 404, "message": "Not found"}},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = ProductSerializer(
            object, data=request.data, context={"request": request}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"body": serializer.data}, status=status.HTTP_200_OK)
        return Response(
            {
                "error": {
                    "code": 422,
                    "message": "Нарушение правил валидации",
                    "errors": serializer.errors,
                }
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)
        try:
            object = Product.objects.get(pk=pk)
        except:
            return Response(
                {"error": {"code": 404, "message": "Not found"}},
                status=status.HTTP_404_NOT_FOUND,
            )
        object.delete()
        return Response({"body": "Product removed"}, status=status.HTTP_200_OK)


class CartView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request):
        if request.user.is_staff:
            return Response({"error": "cant"})
        cart = Cart.objects.filter(user=request.user)
        serializer = CartSeriazlier(cart, many=True)
        data = serializer.data
        return Response({"body": data}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)

        try:
            product = Product.objects.get(pk=pk)
        except:
            return Response({"error": "error"})
        if request.user.is_staff:
            return Response({"error": "cant"})
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.products.add(product)
        serializer = CartSeriazlier(cart)
        return Response({"body": {"message": "Product add to card"}})

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get("pk", None)

        try:
            product = Product.objects.get(pk=pk)
        except:
            return Response({"error": "eror"})
        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart.products.remove(product)
        serializer = CartSeriazlier(cart)
        return Response({"body": {"message": "Item removed from cart"}})


class OrderView(APIView):
    def get(self, request):
        if request.user.is_staff:
            return Response({'error': 'error'})
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response({"body": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        print(request.data)
        if request.user.is_staff:
            return Response({'error': 'error'})
        try:
            cart = Cart.objects.get(user=request.user)
        except:
            return Response(
                {"error": {"code": 422, "message": "Cart is empty"}},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        order = Order.objects.create(user=request.user)
        for product in cart.products.all():
            order.products.add(product)
        cart.delete()
        if request.data['order_price']:
            order.order_price = request.data['order_price']
        else:
            return Response({"data": "Пошел нахрен"})

        
        order.save()
        return Response(
            {
                "body": {
                    "order_id": order.id,
                    "message": "Order is processed",
                }
            }
        )