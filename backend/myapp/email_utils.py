# myapp/email_utils.py
import requests
import os

# Make sure BREVO_API_KEY is set in Render environment variables
BREVO_API_KEY = os.getenv("BREVO_API_KEY")

def send_email(to, subject, html_content):
    """
    Sends an email using Brevo SMTP API.
    Safe for Render deployment.
    """
    if not BREVO_API_KEY:
        print("BREVO_API_KEY not set!")
        return None

    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {"name": "AlertFi", "email": "no-reply@alertfi.com"},
        "to": [{"email": to}],
        "subject": subject,
        "htmlContent": html_content,
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
    except requests.exceptions.RequestException as e:
        print("Email sending failed:", e)
        return None

    return response
