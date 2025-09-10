# myapp/admin.py
from django.contrib import admin
from .models import User, Detector, DetectorReading, FCMToken

@admin.register(DetectorReading)
class DetectorReadingAdmin(admin.ModelAdmin):
    list_display = ('detector', 'ppm', 'temperature', 'humidity', 'status', 'battery', 'timestamp')
    list_filter = ('detector', 'status')
    search_fields = ('detector__name',)

@admin.register(Detector)
class DetectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'sensor_on', 'user')
    readonly_fields = ('sensor_on',)

@admin.register(FCMToken)
class FCMTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at')
    search_fields = ('user__username', 'token')

admin.site.register(User)