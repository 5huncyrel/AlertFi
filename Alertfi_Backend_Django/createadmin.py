from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

User = get_user_model()

def create_default_admin():
    if not User.objects.filter(is_staff=True, email="admin@gmail.com").exists():
        User.objects.create(
            email="admin@gmail.com",
            password=make_password("admin123"),
            is_staff=True,
            is_superuser=True
        )
        print(" Default admin created: admin@gmail.com / admin123")
    else:
        print(" Admin already exists.")

if __name__ == "__main__":
    create_default_admin()