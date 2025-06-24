from django.contrib import admin
from .models import User, Detector, DetectorReading, AlertLog


admin.site.register(User)
admin.site.register(Detector)
admin.site.register(DetectorReading)
admin.site.register(AlertLog)
