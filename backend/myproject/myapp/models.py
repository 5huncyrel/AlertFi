# models.py

from django.db import models
from django.contrib.auth.models import User

class AlertLog(models.Model):
    ALERT_LEVEL_CHOICES = [
        ('safe', 'Safe'),
        ('warning', 'Warning'),
        ('danger', 'Danger'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    alert_level = models.CharField(max_length=10, choices=ALERT_LEVEL_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.alert_level} - {self.timestamp}"