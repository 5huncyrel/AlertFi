import requests
import os

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_SENDER_EMAIL = "no-reply@alertfi.com"  # Must be verified in Brevo

def send_email(to: str, subject: str, html_content: str):
    if not BREVO_API_KEY:
        raise Exception("BREVO_API_KEY is not set in environment!")

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": "AlertFi", "email": BREVO_SENDER_EMAIL},
        "to": [{"email": to}],
        "subject": subject,
        "htmlContent": html_content,
    }

    response = requests.post(url, json=payload, headers=headers)

    if not response.ok:
        raise Exception(f"Brevo email failed: {response.status_code} - {response.text}")

    return response
