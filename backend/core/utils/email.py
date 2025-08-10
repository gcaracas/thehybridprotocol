import markdown
import re
from django.conf import settings
from django.core.signing import dumps, loads, SignatureExpired, BadSignature
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse


def convert_markdown_to_html(content: str) -> str:
    """
    Convert markdown content to HTML
    
    Args:
        content: Markdown content
        
    Returns:
        HTML content
    """
    # Configure markdown with extensions
    md = markdown.Markdown(extensions=['extra', 'codehilite'])
    return md.convert(content)


def html_to_text(html: str) -> str:
    """
    Convert HTML to plain text (minimal fallback)
    
    Args:
        html: HTML content
        
    Returns:
        Plain text content
    """
    return strip_tags(html)


def strip_html_tags(html_content: str) -> str:
    """
    Strip HTML tags to create plain text version
    
    Args:
        html_content: HTML content
        
    Returns:
        Plain text content
    """
    return strip_tags(html_content)


def build_unsub_url(recipient) -> str:
    """
    Build unsubscribe URL with signed token (no expiry for compliance)
    
    Args:
        recipient: EmailSignup instance
        
    Returns:
        Unsubscribe URL
    """
    token = dumps({'rid': recipient.id})  # no expiry for compliance
    return f"{settings.BASE_URL}{reverse('unsubscribe')}?t={token}"


def build_unsubscribe_url(recipient_id: int) -> str:
    """
    Build unsubscribe URL with signed token
    
    Args:
        recipient_id: Recipient ID
        
    Returns:
        Unsubscribe URL
    """
    token = dumps({'rid': recipient_id})
    return f"{settings.BASE_URL}/unsubscribe/?token={token}"


def verify_unsubscribe_token(token: str) -> int:
    """
    Verify and extract recipient ID from unsubscribe token
    
    Args:
        token: Signed token
        
    Returns:
        Recipient ID
        
    Raises:
        SignatureExpired: If token has expired
        BadSignature: If token is invalid
    """
    data = loads(token)  # No expiry for unsubscribe links (compliance requirement)
    return data['rid']


def build_view_url(newsletter) -> str:
    """
    Build view in browser URL for newsletter
    
    Args:
        newsletter: Newsletter instance
        
    Returns:
        View URL
    """
    base = settings.PUBLIC_FRONTEND_URL.rstrip("/")
    path = settings.NEWSLETTER_VIEW_PATH.strip("/")
    return f"{base}/{path}/{newsletter.slug}"


def render_newsletter_email(newsletter, recipient) -> tuple[str, str]:
    """
    Render newsletter email HTML and text versions
    
    Args:
        newsletter: Newsletter instance
        recipient: EmailSignup instance
        
    Returns:
        Tuple of (html_content, text_content)
    """
    # Convert content to HTML if needed
    if newsletter.content:
        content_html = convert_markdown_to_html(newsletter.content)
    else:
        content_html = ""
    
    # Create plain text version
    text_content = strip_html_tags(content_html)
    
    # Build unsubscribe URL
    unsubscribe_url = build_unsubscribe_url(recipient.id)
    
    # Build view in browser URL
    view_url = f"{settings.PUBLIC_FRONTEND_URL}/newsletter/{newsletter.slug}"
    
    # Render HTML template
    html_content = render_to_string('email/newsletter.html', {
        'subject': newsletter.subject,
        'preheader': newsletter.preheader,
        'content_html': content_html,
        'UNSUB': unsubscribe_url,
        'PUBLIC_FRONTEND_URL': settings.PUBLIC_FRONTEND_URL,
        'VIEW_URL': view_url,
    })
    
    return html_content, text_content 