# myapp/views.py


from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, Detector, DetectorReading
from .serializers import (
    UserSerializer, RegisterSerializer,
    DetectorSerializer, DetectorReadingSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView


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


# 📟 List Detectors for Logged-in User
class DetectorListView(generics.ListAPIView):
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

        # ✅ Include sensor_on in the response so Flutter sees the correct value
        data['sensor_on'] = detector.sensor_on  

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


# 📡 ESP32 Endpoint for Sending Data
class ESP32DataReceiveView(APIView):
    permission_classes = []  # No auth for ESP32

    def post(self, request):
        detector_id = request.data.get("detector_id")
        ppm = request.data.get("ppm")
        battery = request.data.get("battery", 100)
        status = request.data.get("status")

        try:
            detector = Detector.objects.get(id=detector_id)
        except Detector.DoesNotExist:
            return Response({"error": "Invalid detector ID"}, status=400)

        # Save all readings
        DetectorReading.objects.create(
            detector=detector,
            ppm=ppm,
            battery=battery,
            status=status
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