from celery import shared_task
from django.utils import timezone
from django.conf import settings
from django.template.loader import render_to_string
from .models import Newsletter, EmailSignup, EmailLog
from .email_providers.factory import get_email_provider
from .utils.email import html_to_text, build_unsub_url, build_view_url, convert_markdown_to_html
import time
import os


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_newsletter_task(self, send_key: str, batch_size: int = None):
    """
    Send newsletter to all subscribed recipients

    Args:
        send_key: Newsletter send key for idempotency
        batch_size: Number of emails to send per batch (defaults to settings.BATCH_SIZE)
    """
    try:
        # Use settings batch size if not provided
        if batch_size is None:
            batch_size = getattr(settings, 'BATCH_SIZE', 500)
        
        # Fetch newsletter by send_key
        try:
            newsletter = Newsletter.objects.get(send_key=send_key)
        except Newsletter.DoesNotExist:
            print(f"Newsletter with send_key {send_key} not found")
            return

        # Check if already sent (idempotency)
        if newsletter.sent_at:
            print(f"Newsletter {send_key} already sent at {newsletter.sent_at}")
            return

        # Get email provider
        provider = get_email_provider()

        # Get all subscribed, non-bounced recipients
        recipients = EmailSignup.objects.filter(
            is_subscribed=True,
            bounce=False,
            is_active=True
        )

        total_recipients = recipients.count()
        print(f"Starting to send newsletter '{newsletter.title}' to {total_recipients} recipients")

        # Convert content to HTML if needed
        if newsletter.content:
            html_body = convert_markdown_to_html(newsletter.content)
        else:
            html_body = ""

        # Build view URL
        view_url = build_view_url(newsletter)
        
        # Render base HTML template with placeholder for unsubscribe
        html = render_to_string(
            "email/newsletter.html",
            {
                "subject": newsletter.subject, 
                "preheader": newsletter.preheader, 
                "content_html": html_body, 
                "UNSUB": "__UNSUB__", 
                "VIEW_URL": view_url,
                "now": timezone.now().year
            },
        )
        
        # Create plain text version
        text = html_to_text(html)

        sent_count = 0
        failed_count = 0

        # Process in batches
        for i in range(0, total_recipients, batch_size):
            batch = recipients[i:i + batch_size]

            for recipient in batch:
                try:
                    # Check if already logged (avoid duplicates)
                    if EmailLog.objects.filter(newsletter=newsletter, recipient=recipient).exists():
                        continue

                    # Replace unsubscribe placeholder with user-specific URL
                    unsub = build_unsub_url(recipient)
                    per_user_html = html.replace("__UNSUB__", unsub)

                    # Send email
                    msg_id = provider.send(
                        to=recipient.email,
                        subject=newsletter.subject,
                        html=per_user_html,
                        text=text,
                        from_email=os.environ["EMAIL_FROM"],
                    )
                    
                    # Log success
                    EmailLog.objects.create(
                        newsletter=newsletter,
                        recipient=recipient,
                        status="sent",
                        provider_message_id=msg_id
                    )
                    sent_count += 1

                except Exception as e:
                    # Log failure
                    EmailLog.objects.create(
                        newsletter=newsletter,
                        recipient=recipient,
                        status="failed",
                        error=str(e)
                    )
                    failed_count += 1
                    print(f"Failed to send to {recipient.email}: {e}")

            # Progress update
            print(f"Processed batch {i//batch_size + 1}: {sent_count} sent, {failed_count} failed")

            # Rate limiting - sleep between batches to be friendly with provider limits
            if i + batch_size < total_recipients:
                time.sleep(getattr(settings, "RATE_SLEEP_SEC", 0.5))

        # Mark newsletter as sent
        newsletter.sent_at = timezone.now()
        newsletter.save()

        print(f"Newsletter sending completed: {sent_count} sent, {failed_count} failed")

    except Exception as e:
        print(f"Newsletter sending failed: {e}")
        # Retry the task
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_test_newsletter_task(self, newsletter_id: int, test_email: str):
    """
    Send test newsletter to a single email address

    Args:
        newsletter_id: Newsletter ID
        test_email: Test recipient email
    """
    try:
        # Fetch newsletter
        try:
            newsletter = Newsletter.objects.get(id=newsletter_id)
        except Newsletter.DoesNotExist:
            print(f"Newsletter with ID {newsletter_id} not found")
            return

        # Get email provider
        provider = get_email_provider()

        # Create or get test recipient
        recipient, created = EmailSignup.objects.get_or_create(
            email=test_email,
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'source': 'test'
            }
        )

        # Convert content to HTML if needed
        if newsletter.content:
            html_body = convert_markdown_to_html(newsletter.content)
        else:
            html_body = ""

        # Build view URL
        view_url = build_view_url(newsletter)
        
        # Build unsubscribe URL
        unsub = build_unsub_url(recipient)
        
        # Render HTML template
        html = render_to_string(
            "email/newsletter.html",
            {
                "subject": newsletter.subject, 
                "preheader": newsletter.preheader, 
                "content_html": html_body, 
                "UNSUB": unsub, 
                "VIEW_URL": view_url,
                "now": timezone.now().year
            },
        )
        
        # Create plain text version
        text = html_to_text(html)

        # Send email
        msg_id = provider.send(
            to=recipient.email,
            subject=f"[TEST] {newsletter.subject}",
            html=html,
            text=text,
            from_email=os.environ["EMAIL_FROM"],
        )

        print(f"Test email sent to {test_email} with message ID: {msg_id}")

    except Exception as e:
        print(f"Test newsletter sending failed: {e}")
        raise self.retry(exc=e) 