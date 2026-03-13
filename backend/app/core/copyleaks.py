import requests
import json
import time
from app.core.config import settings

class CopyleaksService:
    def __init__(self):
        self.base_url = "https://id.copyleaks.com"
        self.api_url = "https://api.copyleaks.com"
        self.email = settings.COPYLEAKS_EMAIL
        self.api_key = settings.COPYLEAKS_API_KEY
        self.token = None

    def authenticate(self):
        """Authenticate with Copyleaks and get a token"""
        url = f"{self.base_url}/v3/login/api"
        payload = {
            "email": self.email,
            "key": self.api_key
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        
        if response.status_code == 200:
            self.token = response.json().get('access_token')
            return self.token
        else:
            raise Exception(f"Authentication failed: {response.text}")

    def submit_text(self, text, scan_id):
        """Submit text for scanning"""
        if not self.token:
            self.authenticate()

        url = f"{self.api_url}/v3/scans/submit/text/{scan_id}"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        payload = {
            "base64": text.encode('utf-8').hex(), # Simplified, Copyleaks expects base64 usually
            "filename": "document.txt",
            "properties": {
                "sandbox": True # Use sandbox for testing
            }
        }
        # In actual base64
        import base64
        payload["base64"] = base64.b64encode(text.encode('utf-8')).decode('utf-8')

        response = requests.put(url, data=json.dumps(payload), headers=headers)
        if response.status_code == 201 or response.status_code == 200:
            return scan_id
        else:
            raise Exception(f"Submission failed: {response.text}")

    def get_results(self, scan_id):
        """
        Copyleaks is asynchronous. Usually, it uses webhooks.
        For a simple demo, we can check status if available or use a simplified mock 
        if we don't have a full webhook setup yet.
        """
        # Note: In production, you'd handle the 'completed' webhook.
        # This is a placeholder for the logic to fetch results.
        return {
            "similarity": 45,
            "sources": [
                {"title": "Wikipedia", "url": "https://en.wikipedia.org", "percentage": 30},
                {"title": "Academic Journal", "url": "https://journal.edu", "percentage": 15}
            ],
            "highlighted": "Sample highlighted response from Copyleaks API..." 
        }

copyleaks_service = CopyleaksService()
