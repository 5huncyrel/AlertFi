import os
import django
from django.contrib.auth.hashers import make_password

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')  
django.setup()

from myapp.models import Admin

def create_default_admin():
    if not Admin.objects.exists():
        Admin.objects.create(
            email="admin@gmail.com",
            password=make_password("admin123"),
            full_name="Administrstor"
        )
        print("✅ Default website admin created: admin@gmail.com / admin123")
    else:
        print("ℹ️ Admin already exists. No action taken.")

if __name__ == "__main__":
    create_default_admin()
