from django.contrib import admin
from .models import AlertLog

@admin.register(AlertLog)
class AlertLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'alert_level', 'message', 'timestamp')
    search_fields = ('user__username', 'message')
    list_filter = ('alert_level', 'timestamp')