# myapp/serializers.py
from rest_framework import serializers
from .models import User, Admin, Detector, DetectorReading, FCMToken
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'address', 'notifications_enabled')

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'email', 'full_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('email', 'full_name', 'address' 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data.get('full_name', ''),
            address=validated_data.get('address', ''),
            password=validated_data['password']
        )
        return user


class DetectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detector
        fields = ['id', 'name', 'location', 'sensor_on'] 
        read_only_fields = ['id', 'sensor_on']


class DetectorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectorReading
        fields = '__all__'


# ✅ NEW: FCM Token Serializer
class FCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMToken
        fields = ('token',)