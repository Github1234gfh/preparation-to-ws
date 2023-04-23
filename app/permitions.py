from rest_framework.permissions import BasePermission

class NotAdminPermition(BasePermission):
    def has_permission(self, request, view):
        return not request.user.is_staff