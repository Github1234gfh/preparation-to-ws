from rest_framework.views import APIView
from django.http import JsonResponse
from .serializers import *
from .models import *
from rest_framework.authtoken.models import Token


class SignUp(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = Token.objects.create(user=user)
            return JsonResponse({
                'data': {
                    'user_token': token.key
                }
            }, status=201)
        return JsonResponse({
            'error': {
                'code': 422,
                'message': 'Нарушение правил валидации',
                'errors': serializer.errors
            }
        }, status=422)


class Login(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
            except:
                return JsonResponse({
                    "error": {
                        "code": 401,
                        "message": "Authentication failed"
                    }
                }, status=401
                )
            if LoginSerializer(user).data['password'] != request.data['password']:
                return JsonResponse({
                    "error": {
                        "code": 401,
                        "message": "Authentication failed"
                    }
                }, status=401
                )
            token, create = Token.objects.get_or_create(user=user)

            return JsonResponse({
                'data': {
                    'user_token': token.key
                }
            }, status=201)

        return JsonResponse({
            'error': {
                'code': 422,
                'message': 'Нарушение правил валидации',
                'errors': serializer.errors
            }
        }, status=422)


class Logout(APIView):

    def get(self, request):
        if request.user.is_active:
            request.user.auth_token.delete()
            return JsonResponse({
                'data': {
                    'message': 'logout'
                }
            }, status=200)
        return JsonResponse(
            {
                "error": {
                    "code": 403,
                    "message": "Login failed"
                }
            }, status=403
        )


class ProductView(APIView):

    def checkAuth(self, request):
        if not request.user.is_active:
            return JsonResponse(
                {
                    "error": {
                        "code": 403,
                        "message": "Login failed"
                    }
                }, status=403
            )
        if not request.user.is_staff:
            return JsonResponse({
                "error": {
                    "code": 403,
                    "message": "Forbidden for you"

                }
            }, status=403)
        return False

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return JsonResponse({
            "data": serializer.data
        }, status=200)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if self.checkAuth(request):
            return self.checkAuth(request)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "data": {
                    "id": serializer.data['id'],
                    "message": 'Product added'
                }
            }, status=201)
        return JsonResponse({
            'error': {
                'code': 422,
                'message': 'Нарушение правил валидации',
                'errors': serializer.errors
            }
        }, status=422)

    def patch(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)

        if self.checkAuth(request):
            return self.checkAuth(request)
        try:
            product = Product.objects.get(pk=pk)
        except:
            return JsonResponse({
                "error": {
                    "code": 404,
                    "message": "Not found"
                }
            }, status=404)
        serializer = ProductSerializer(product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({
                "data": serializer.data
            })

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)

        if self.checkAuth(request):
            return self.checkAuth(request)
        try:
            product = Product.objects.get(pk=pk)
        except:
            return JsonResponse({
                "error": {
                    "code": 404,
                    "message": "Not found"
                }
            }, status=404)
        product.delete()
        return JsonResponse({
            "data": {
                "message": "Product removed"
            }
        })


class CartView(APIView):

    def NotFound(self, request):
        return JsonResponse({
            "error": {
                "code": 404,
                "message": "Not found"
            }
        }, status=404)

    def checkAuth(self, request):
        if not request.user.is_active:
            return JsonResponse(
                {
                    "error": {
                        "code": 403,
                        "message": "Login failed"
                    }
                }, status=403
            )
        if request.user.is_staff:
            return JsonResponse({
                "error": {
                    "code": 403,
                    "message": "Forbidden for you"

                }
            }, status=403)
        return False

    def get(self, request):

        if self.checkAuth(request):
            return self.checkAuth(request)

        cart, create = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, many=False)

        return JsonResponse({
            "data": serializer.data['products']
        }, status=200)

    def post(self, request, *args, **kwargs):

        if self.checkAuth(request):
            return self.checkAuth(request)

        pk = kwargs.get('pk', None)

        try:
            product = Product.objects.get(pk=pk)
        except:
            return self.NotFound(request)

        cart, create = Cart.objects.get_or_create(user=request.user)

        cart.products.add(product)
        return JsonResponse({
            'data': {
                'message': "Product add to card"
            }
        }, status=201)

    def delete(self, request, *args, **kwargs):
        if self.checkAuth(request):
            return self.checkAuth(request)

        pk = kwargs.get('pk', None)

        try:
            product = Product.objects.get(pk=pk)
        except:
            return self.NotFound(request)

        cart, create = Cart.objects.get_or_create(user=request.user)
        cart.products.remove(product)
        return JsonResponse(
            {
                "data": {
                    "message": "Item removed from cart"
                }
            }, status=200
        )

class OrderView(APIView):
    def checkAuth(self, request):
        if not request.user.is_active:
            return JsonResponse(
                {
                    "error": {
                        "code": 403,
                        "message": "Login failed"
                    }
                }, status=403
            )
        if request.user.is_staff:
            return JsonResponse({
                "error": {
                    "code": 403,
                    "message": "Forbidden for you"

                }
            }, status=403)
        return False

    def get(self, request):
        if self.checkAuth(request):
            return self.checkAuth(request)
        order = Order.objects.filter(user=request.user)


        serializers = OrderSerializer(order, many=True)
        return JsonResponse(
            {
                'data': serializers.data
            }, status=200
        )

    def post(self, request):
        if self.checkAuth(request):
            return self.checkAuth(request)
        try:
            cart = Cart.objects.get()
        except:
            return JsonResponse(
                {
                    'error': {
                        'code': 422,
                        'message': 'Cart is empty'
                    }
                }, status=422
            )

        if len(cart.products.all()) == 0:
            return JsonResponse(
                {
                    'error': {
                        'code': 422,
                        'message': 'Cart is empty'
                    }
                }, status=422
            )
        order = Order.objects.create(user=request.user)
        total_price = 0
        for product in cart.products.all():
            order.products.add(product)
            total_price += product.price
            cart.products.remove(product)
        order.order_price = total_price
        order.save()

        return JsonResponse({
            "data": {
                'order_id': order.id,
                "message": 'Order is processed'
            }
        })
