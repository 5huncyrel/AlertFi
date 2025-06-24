# models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    notifications_enabled = models.BooleanField(default=True)

class Detector(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.location})"

class DetectorReading(models.Model):
    detector = models.ForeignKey(Detector, on_delete=models.CASCADE)
    ppm = models.IntegerField()
    status = models.CharField(max_length=50)
    battery = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.detector.name} - {self.ppm} PPM {self.status} @ {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

