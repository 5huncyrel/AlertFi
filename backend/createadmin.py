import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth.models import User

def create_default_admin():
    if not User.objects.filter(is_staff=True).exists():
        User.objects.create_user(
            username="admin",
            email="admin@gmail.com",
            password="admin123",
            is_staff=True,
            is_superuser=False
        )
        print("✅ Default website admin created: admin@gmail.com / admin123")
    else:
        print("ℹ️ Website admin already exists. No action taken.")

if __name__ == "__main__":
    create_default_admin()
