# myapp/urls.py

from django.urls import path
from .views import (
    RegisterView, UserDetailView, UpdateEmailView, ChangePasswordView,
    DetectorListView, DetectorDataView, AlertHistoryView, ESP32DataReceiveView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('user/', UserDetailView.as_view()),
    path('user/update-email/', UpdateEmailView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
    path('detectors/', DetectorListView.as_view()),
    path('detectors/<int:pk>/data/', DetectorDataView.as_view()),
    path('detectors/<int:pk>/alerts/', AlertHistoryView.as_view()),
    path('esp32/data/', ESP32DataReceiveView.as_view()),
]