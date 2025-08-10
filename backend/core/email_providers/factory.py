from django.conf import settings
from .base import EmailProvider
from .postmark import PostmarkProvider


def get_email_provider() -> EmailProvider:
    """
    Get email provider based on EMAIL_PROVIDER setting
    
    Returns:
        EmailProvider instance
    """
    provider_name = settings.EMAIL_PROVIDER.lower()
    
    if provider_name == 'postmark':
        return PostmarkProvider()
    else:
        raise ValueError(f"Unsupported email provider: {provider_name}") 