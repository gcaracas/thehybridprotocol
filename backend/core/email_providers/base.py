from abc import ABC, abstractmethod
from typing import Optional, Union


class EmailProvider(ABC):
    """Base class for email providers"""

    @abstractmethod
    def send(self, *, to: str, subject: str, html: str, text: str, from_email: str, reply_to: Optional[str] = None) -> str:
        """
        Send an email

        Args:
            to: Recipient email address
            subject: Email subject
            html: HTML content
            text: Plain text content
            from_email: Sender email address
            reply_to: Reply-to email address (optional)

        Returns:
            Provider message ID
        """
        raise NotImplementedError 