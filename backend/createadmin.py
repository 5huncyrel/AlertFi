import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_default_admin():
    if not User.objects.filter(is_staff=True).exists():
        User.objects.create_superuser(
            username="admin@gmail.com",
            email="admin@gmail.com",
            password="admin123"
        )
        print("✅ Default superuser created: admin@gmail.com / admin123")
    else:
        print("ℹ️ Superuser already exists. No action taken.")

if __name__ == "__main__":
    create_default_admin()
