# myapp/admin.py
from django.contrib import admin
from .models import User, Detector, DetectorReading, FCMToken


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'full_name', 'address', 'notifications_enabled')
    search_fields = ('username', 'email', 'full_name', 'address')
    list_filter = ( 'notifications_enabled',)

@admin.register(DetectorReading)
class DetectorReadingAdmin(admin.ModelAdmin):
    list_display = (
        'detector',
        'user_address',  
        'ppm',
        'temperature',
        'humidity',
        'status',
        'timestamp'
    )
    list_filter = ('detector', 'status')
    search_fields = ('detector__name', 'detector__user__address') 

    def user_address(self, obj):
        return obj.detector.user.address
    user_address.short_description = 'User Address'


@admin.register(Detector)
class DetectorAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'sensor_on', 'battery', 'user')
    readonly_fields = ('sensor_on', 'battery')

@admin.register(FCMToken)
class FCMTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'created_at')
    search_fields = ('user__username', 'token')

