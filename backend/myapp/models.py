# myapp/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    notifications_enabled = models.BooleanField(default=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    
    
class Admin(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=100)

    def __str__(self):
        return self.email


class Detector(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    sensor_on = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.location})"


class DetectorReading(models.Model):
    detector = models.ForeignKey(Detector, on_delete=models.CASCADE)
    ppm = models.IntegerField()  
    temperature = models.FloatField(null=True, blank=True)  
    humidity = models.FloatField(null=True, blank=True)     
    status = models.CharField(max_length=50)
    battery = models.IntegerField()
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