# myapp/serializers.py

from rest_framework import serializers
from .models import AlertLog

class AlertLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertLog
        fields = ['message', 'alert_level', 'timestamp']