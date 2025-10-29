# myapp/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from .notifications import send_push_notification
from django.contrib.auth.hashers import check_password
from .models import User, Admin, Detector, DetectorReading, FCMToken
from .serializers import (
    UserSerializer, AdminSerializer, RegisterSerializer,
    DetectorSerializer, DetectorReadingSerializer, FCMTokenSerializer
)



# 🔐 User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# 👤 Authenticated User Info
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ✉️ Update Email
class UpdateEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        email = request.data.get('email')
        request.user.email = email
        request.user.save()
        return Response({'message': 'Email updated'})


# 🔒 Change Password
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        password = request.data.get('password')
        request.user.set_password(password)
        request.user.save()
        return Response({'message': 'Password changed'})



# 📟 List & Add Detectors for Logged-in User
class DetectorListView(generics.ListCreateAPIView):
    serializer_class = DetectorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Detector.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DetectorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DetectorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Detector.objects.filter(user=self.request.user)


# 🏠 Home: Latest Detector Reading (SAFE, WARNING, DANGER)
class DetectorDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            detector = Detector.objects.get(id=pk, user=request.user)
        except Detector.DoesNotExist:
            return Response({'error': 'Detector not found'}, status=404)

        latest = DetectorReading.objects.filter(detector=detector).first()
        data = DetectorReadingSerializer(latest).data if latest else {}

        data['sensor_on'] = detector.sensor_on
        data['name'] = detector.name            
        data['location'] = detector.location   

        return Response(data)


# 📜 History: WARNING and DANGER Only
class DetectorReadingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        readings = DetectorReading.objects.filter(
            detector__id=pk,
            detector__user=request.user,
            status__in=["WARNING", "DANGER"]
        )
        return Response(DetectorReadingSerializer(readings, many=True).data)


class DetectorReadingDetailView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = DetectorReading.objects.all()
    serializer_class = DetectorReadingSerializer

    def get_queryset(self):
        return self.queryset.filter(detector__user=self.request.user)


# 💡 Configure Detector WiFi and User Info
class ConfigureDetectorView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            detector = Detector.objects.get(id=pk, user=request.user)
        except Detector.DoesNotExist:
            return Response({'error': 'Detector not found'}, status=404)

        detector.wifi_ssid = request.data.get("wifi_ssid", detector.wifi_ssid)
        detector.wifi_password = request.data.get("wifi_password", detector.wifi_password)
        detector.user_email = request.data.get("user_email", detector.user_email)
        detector.user_password = request.data.get("user_password", detector.user_password)
        detector.save()

        return Response({
            "message": "Detector configuration updated successfully",
            "detector_id": detector.id
        }, status=200)
        

# 💡 ESP32 fetches its configuration by Detector ID
class ESP32ConfigFetchView(APIView):
    def get(self, request):
        detector_id = request.query_params.get("detector_id")
        if not detector_id:
            return Response({"error": "Detector ID required"}, status=400)

        try:
            detector = Detector.objects.get(id=detector_id)
        except Detector.DoesNotExist:
            return Response({"error": "Detector not registered"}, status=404)

        return Response({
            "detector_id": detector.id,
            "wifi_ssid": detector.wifi_ssid,
            "wifi_password": detector.wifi_password,
            "user_email": detector.user_email,
            "user_password": detector.user_password,
            "api_url": "https://alertfi.onrender.com/api/esp32/data/"
        })



# 🌐 Website Admin Endpoints
@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    """
    Allows the website admin to log in using email and password.
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            admin = Admin.objects.get(email=email)
            if check_password(password, admin.password):
                serializer = AdminSerializer(admin)
                return Response({
                    "message": "Login successful",
                    "admin": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
        except Admin.DoesNotExist:
            return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminUsersView(APIView):
    """
    Returns a list of all registered users for the admin dashboard.
    """
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class AdminDetectorsView(APIView):
    """
    Returns a list of all detectors in the system.
    """
    def get(self, request):
        detectors = Detector.objects.select_related('user').all()
        serializer = DetectorSerializer(detectors, many=True)
        return Response(serializer.data)


class AdminReadingsView(APIView):
    """
    Returns recent detector readings for all detectors.
    """
    def get(self, request):
        readings = DetectorReading.objects.select_related('detector').all()[:100]
        serializer = DetectorReadingSerializer(readings, many=True)
        return Response(serializer.data)




# 📡 ESP32 Endpoint for Receiving Data
class ESP32DataReceiveView(APIView):
    permission_classes = []  # No auth for ESP32

    def post(self, request):
        detector_id = request.data.get("detector_id")
        ppm = request.data.get("ppm")
        battery = request.data.get("battery", 100)
        status = request.data.get("status")
        temperature = request.data.get("temperature")  # 🌡️ NEW
        humidity = request.data.get("humidity")        # 💧 NEW

        try:
            detector = Detector.objects.get(id=detector_id)
        except Detector.DoesNotExist:
            return Response({"error": "Invalid detector ID"}, status=400)

        # Save the reading
        reading = DetectorReading.objects.create(
            detector=detector,
            ppm=ppm,
            battery=battery,
            status=status,
            temperature=temperature,  # ✅ NEW
            humidity=humidity         # ✅ NEW
        )

        # ✅ Push notification if danger
        if status == "DANGER" and detector.user.notifications_enabled:
            tokens = FCMToken.objects.filter(user=detector.user).values_list('token', flat=True)
            for token in tokens:
                send_push_notification(
                    token,
                    "🚨 Fire Alert",
                    f"{detector.name} detected dangerous gas levels!"
                )

        return Response({"message": "Data received"}, status=201)



# ✅ Toggle Sensor On/Off
class ToggleSensorView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            detector = Detector.objects.get(id=pk, user=request.user)
            detector.sensor_on = not detector.sensor_on
            detector.save()
            return Response({'sensor_on': detector.sensor_on})
        except Detector.DoesNotExist:
            return Response({'error': 'Detector not found'}, status=404)


# 🔐 Save FCM Token from Mobile App
class FCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token is required'}, status=400)

        FCMToken.objects.update_or_create(user=request.user, token=token)
        return Response({'message': 'Token saved'})
    
    
# ✅ Toggle Notifications On/Off
class ToggleNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        user.notifications_enabled = not user.notifications_enabled
        user.save()
        return Response({
            'notifications_enabled': user.notifications_enabled})
        