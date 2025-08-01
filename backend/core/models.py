from django.db import models
from django.utils import timezone
from django.conf import settings


def get_current_date():
    """Return current date for default values"""
    return timezone.now().date()


class Newsletter(models.Model):
    """Model for newsletter articles"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=500, help_text="Brief description for previews")
    featured_image = models.ImageField(upload_to='newsletter_images/', blank=True, null=True, help_text="Featured image for newsletter")
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.published and not self.published_at:
            self.published_at = timezone.now()
        elif not self.published:
            self.published_at = None
        super().save(*args, **kwargs)
    
    @property
    def featured_image_url(self):
        """Return the featured image URL if available"""
        if self.featured_image and hasattr(self.featured_image, 'url'):
            try:
                # Use BASE_URL if available, otherwise use relative URL
                if hasattr(settings, 'BASE_URL') and settings.BASE_URL:
                    return f"{settings.BASE_URL}{self.featured_image.url}"
                return self.featured_image.url
            except (ValueError, AttributeError):
                return None
        return None


class PodcastEpisode(models.Model):
    """Model for podcast episodes"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    description = models.TextField()
    script = models.TextField(blank=True, help_text="Full episode script or transcript")
    publish_date = models.DateField(default=get_current_date)
    audio_url = models.URLField(help_text="URL to audio file")
    youtube_url = models.URLField(blank=True, null=True, help_text="YouTube video URL")
    spotify_url = models.URLField(blank=True, null=True, help_text="Spotify episode URL")
    cover_image = models.ImageField(upload_to='podcast_covers/', blank=True, null=True, help_text="Episode cover image")
    episode_number = models.PositiveIntegerField(unique=True, blank=True, null=True, help_text="Episode number (optional)")
    duration = models.CharField(max_length=20, blank=True, help_text="Duration in format: HH:MM:SS")
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-publish_date']
    
    def __str__(self):
        if self.episode_number:
            return f"Episode {self.episode_number}: {self.title}"
        return self.title
    
    @property
    def cover_image_url(self):
        """Return the cover image URL if available"""
        if self.cover_image and hasattr(self.cover_image, 'url'):
            try:
                # Use BASE_URL if available, otherwise use relative URL
                if hasattr(settings, 'BASE_URL') and settings.BASE_URL:
                    return f"{settings.BASE_URL}{self.cover_image.url}"
                return self.cover_image.url
            except (ValueError, AttributeError):
                return None
        return None


class EmailSignup(models.Model):
    """Model for email newsletter signups"""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    source = models.CharField(
        max_length=50, 
        default='website',
        help_text="Where the signup came from (website, podcast, etc.)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return f"{name} ({self.email})" if name else self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()