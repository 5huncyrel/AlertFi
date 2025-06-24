from django.contrib import admin
from .models import User, Detector, DetectorReading

@admin.register(DetectorReading)
class DetectorReadingAdmin(admin.ModelAdmin):
    list_display = ('detector', 'ppm', 'status', 'battery', 'timestamp')
    list_filter = ('detector',)
    search_fields = ('detector__name',)


admin.site.register(User)
admin.site.register(Detector)
