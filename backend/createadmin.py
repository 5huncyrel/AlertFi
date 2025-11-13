import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_default_admin():
    email = "admin@gmail.com"
    password = "admin123"
    username = "admin"  # can match email or anything

    # Check if admin already exists
    if not User.objects.filter(username=username, is_staff=True).exists():
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f"✅ Website admin created: {email} / {password}")
    else:
        print("ℹ️ Website admin already exists.")

if __name__ == "__main__":
    create_default_admin()