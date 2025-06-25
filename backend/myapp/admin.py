# myapp/admin.py

from django.contrib import admin
from .models import User, Detector, DetectorReading

@admin.register(DetectorReading)
class DetectorReadingAdmin(admin.ModelAdmin):
    list_display = ('detector', 'ppm', 'status', 'battery', 'timestamp')
    list_filter = ('detector',)
    search_fields = ('detector__name',)

@admin.register(Detector)
class DetectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'sensor_on', 'user')
    readonly_fields = ('sensor_on',)  

admin.site.register(User)