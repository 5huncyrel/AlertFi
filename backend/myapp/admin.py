from django.contrib import admin
from .models import User, Detector, DetectorReading, AlertLog

@admin.register(DetectorReading)
class DetectorReadingAdmin(admin.ModelAdmin):
    list_display = ('detector', 'ppm', 'battery', 'timestamp')
    list_filter = ('detector',)
    search_fields = ('detector__name',)

@admin.register(AlertLog)
class AlertLogAdmin(admin.ModelAdmin):
    list_display = ('detector', 'status', 'ppm', 'created_at')
    list_filter = ('status', 'detector')
    search_fields = ('detector__name',)

admin.site.register(User)
admin.site.register(Detector)
