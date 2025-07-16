# myapp/serializers.py
from rest_framework import serializers
from .models import User, Detector, DetectorReading, FCMToken
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'notifications_enabled')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
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