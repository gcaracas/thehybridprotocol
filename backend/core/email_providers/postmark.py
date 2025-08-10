from django.conf import settings
from postmarker.core import PostmarkClient
from typing import Optional
from .base import EmailProvider


class PostmarkProvider(EmailProvider):
    """Postmark email provider implementation"""

    def __init__(self):
        self.client = PostmarkClient(server_token=settings.EMAIL_API_KEY)

    def send(self, *, to: str, subject: str, html: str, text: str, from_email: str, reply_to: Optional[str] = None) -> str:
        """
        Send email via Postmark

        Args:
            to: Recipient email address
            subject: Email subject
            html: HTML content
            text: Plain text content
            from_email: Sender email address
            reply_to: Reply-to email address (optional)

        Returns:
            Postmark message ID
        """
        try:
            payload = {
                "From": from_email,
                "To": to,
                "Subject": subject,
                "HtmlBody": html,
                "TextBody": text,
                "MessageStream": "outbound"
            }
            if reply_to:
                payload["ReplyTo"] = reply_to
                
            response = self.client.emails.send(**payload)
            return response['MessageID']
        except Exception as e:
            # Log the error but don't raise it to allow for retries
            print(f"Postmark send error: {e}")
            raise 