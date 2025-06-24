# myapp/views.py


from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User, Detector, DetectorReading, AlertLog
from .serializers import (
    UserSerializer, RegisterSerializer,
    DetectorSerializer, DetectorReadingSerializer, AlertLogSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class UpdateEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        email = request.data.get('email')
        request.user.email = email
        request.user.save()
        return Response({'message': 'Email updated'})

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        password = request.data.get('password')
        request.user.set_password(password)
        request.user.save()
        return Response({'message': 'Password changed'})

class DetectorListView(generics.ListAPIView):
    serializer_class = DetectorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Detector.objects.filter(user=self.request.user)

class DetectorDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        detector = Detector.objects.get(id=pk, user=request.user)
        latest = DetectorReading.objects.filter(detector=detector).first()
        return Response(DetectorReadingSerializer(latest).data)

class AlertHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        logs = AlertLog.objects.filter(detector__id=pk, detector__user=request.user)
        return Response(AlertLogSerializer(logs, many=True).data)

    def post(self, request, pk):
        detector = Detector.objects.get(id=pk)
        data = request.data.copy()
        data['detector'] = detector.id
        serializer = AlertLogSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

        # Always store detector reading
        DetectorReading.objects.create(
            detector=detector,
            ppm=ppm,
            battery=battery,
        )

        # Store only if status is WARNING or DANGER
        if status in ["WARNING", "DANGER"]:
            AlertLog.objects.create(
                detector=detector,
                status=status,
                ppm=ppm
            )

        return Response({"message": "Data received"}, status=201)