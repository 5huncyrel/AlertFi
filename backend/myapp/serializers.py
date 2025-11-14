# myapp/serializers.py
from rest_framework import serializers
from .models import User, Detector, DetectorReading, FCMToken
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='full_name', read_only=True)
    registered = serializers.DateTimeField(source='date_joined', format="%Y-%m-%d", read_only=True)
   
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'name', 'notifications_enabled', 'address', 'registered')


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
    user = serializers.IntegerField(source='user.id', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Detector
        fields = ['id', 'name', 'location', 'sensor_on', 'user', 'status']

    def get_status(self, obj):
        latest = obj.detectorreading_set.first()
        return latest.status if latest else "Unknown"


# ✅ NEW: FCM Token Serializer
class FCMTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMToken
        fields = ('token',)