# myapp/urls.py


from django.urls import path
from .views import RegisterView, LoginView, ProtectedView, AlertLogListCreateView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('protected/', ProtectedView.as_view()),
    path('alerts/', AlertLogListCreateView.as_view()),  
]