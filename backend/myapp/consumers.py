# myapp/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import AlertLog
from channels.db import database_sync_to_async

class AlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_authenticated:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            ppm = data.get("ppm")

            if ppm is not None:
                # Determine alert level
                if ppm > 2000:
                    alert_level = 'danger'
                elif ppm > 1000:
                    alert_level = 'warning'
                else:
                    alert_level = 'safe'

                message = f"PPM: {ppm}"

                # Save to DB
                await self.save_alert(self.scope["user"], message, alert_level)

                # Send to frontend
                await self.send(text_data=json.dumps({
                    "message": message,
                    "alert_level": alert_level
                }))
            else:
                await self.send(text_data=json.dumps({
                    "status": "error",
                    "message": "Missing 'ppm' in received data."
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "status": "error",
                "message": "Invalid JSON format."
            }))

    @database_sync_to_async
    def save_alert(self, user, message, alert_level):
        AlertLog.objects.create(user=user, message=message, alert_level=alert_level)