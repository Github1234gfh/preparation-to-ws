from django.http import JsonResponse


def custom_exception_handler(exc, context=None):
    try:
        if exc.default_code == 'not_authenticated' or exc.default_code == 'authentication_failed':
            return JsonResponse({"error": {"code": 403, "message": "Login failed"}}, status=403)
        if exc.default_code == 'permission_denied':
            return JsonResponse({"error": {"code": 403, "message": "Forbidden for you"}}, status=403)
        if exc.default_code == 'invalid':
            return JsonResponse({"error":
                                     {"code": 422,
                                      "message": "Validation error",
                                      "errors": exc.detail
                                      }},
                                status=422)
    except:
        return JsonResponse({"error": {"code": 404, "message": "Not found"}}, status=404)
