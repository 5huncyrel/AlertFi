# myapp/notifications.py

import firebase_admin
from firebase_admin import credentials, messaging
import os

# Initialize Firebase only once
if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'alertfi-67490-firebase-adminsdk-fbsvc-6062825ace.json')
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)


def send_push_notification(token, title, body):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=token,
        )
        response = messaging.send(message)
        print(f'✅ Successfully sent message: {response}')
        return response
    except Exception as e:
        print(f'❌ Error sending push notification: {e}')
        return None