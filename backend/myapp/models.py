# myapp/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import random


class User(AbstractUser):
    notifications_enabled = models.BooleanField(default=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=255, blank=True, null=True)
   
    def generate_verification_token(self):
        code = f"{random.randint(100000, 999999)}"
        self.verification_token = code
        self.save()
        return code



class Detector(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    sensor_on = models.BooleanField(default=True)
    detector_code = models.CharField(max_length=6, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.detector_code:
            # Generate unique 6-digit code
            while True:
                code = f"{random.randint(100000, 999999)}"
                if not Detector.objects.filter(detector_code=code).exists():
                    self.detector_code = code
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.location})"


class DetectorReading(models.Model):
    detector = models.ForeignKey(Detector, on_delete=models.CASCADE)
    ppm = models.IntegerField()  
    temperature = models.FloatField(null=True, blank=True)  
    humidity = models.FloatField(null=True, blank=True)     
    status = models.CharField(max_length=50)
    battery = models.IntegerField(default=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return (
            f"{self.detector.name} - {self.ppm} PPM, "
            f"{self.temperature}°C, {self.humidity}% - "
            f"{self.status} @ {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"
        )



class FCMToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.token[:20]}"