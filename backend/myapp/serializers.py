# myapp/serializers.py
from rest_framework import serializers
from .models import User, Detector, DetectorReading, FCMToken
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name','notifications_enabled', 'address')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'full_name', 'address')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            address=validated_data.get('address', '')
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


class AdminDetectorSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # include full user info
    latest_reading = serializers.SerializerMethodField()

    class Meta:
        model = Detector
        fields = ['id', 'name', 'location', 'sensor_on', 'user', 'latest_reading']

    def get_latest_reading(self, obj):
        latest = DetectorReading.objects.filter(detector=obj).first()
        return DetectorReadingSerializer(latest).data if latest else None


# ✅ NEW: FCM Token Serializer
class FCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMToken
        fields = ('token',)