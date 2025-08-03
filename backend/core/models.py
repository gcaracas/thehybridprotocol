from django.db import models
from django.utils import timezone
from django.conf import settings


def get_current_date():
    """Return current date for default values"""
    return timezone.now().date()


class LocalizedElement(models.Model):
    """Model for storing localized strings (English and Spanish)"""
    id = models.AutoField(primary_key=True)
    english = models.CharField(max_length=500, help_text="English text")
    spanish = models.CharField(max_length=500, help_text="Spanish text")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['id']
        verbose_name = "Localized Element"
        verbose_name_plural = "Localized Elements"
    
    def __str__(self):
        return f"{self.english[:50]}... / {self.spanish[:50]}..."


class Category(models.Model):
    """Model for content categories"""
    name = models.ForeignKey(
        LocalizedElement, 
        on_delete=models.CASCADE,
        related_name='category_names',
        help_text="Localized category name"
    )
    slug = models.SlugField(unique=True, max_length=100)
    count = models.PositiveIntegerField(default=0, help_text="Number of items in this category")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name__english']
        verbose_name = "Category"
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name.english


class Tag(models.Model):
    """Model for content tags"""
    name = models.ForeignKey(
        LocalizedElement, 
        on_delete=models.CASCADE,
        related_name='tag_names',
        help_text="Localized tag name"
    )
    slug = models.SlugField(unique=True, max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name__english']
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
    
    def __str__(self):
        return self.name.english


class Archive(models.Model):
    """Model for archive entries"""
    month = models.PositiveIntegerField(help_text="Month (1-12)")
    year = models.PositiveIntegerField(help_text="Year")
    count = models.PositiveIntegerField(default=0, help_text="Number of items in this archive")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-year', '-month']
        unique_together = ['month', 'year']
        verbose_name = "Archive"
        verbose_name_plural = "Archives"
    
    def __str__(self):
        return f"{self.get_month_display()} {self.year}"
    
    def get_month_display(self):
        """Return localized month name"""
        month_names = {
            1: "January", 2: "February", 3: "March", 4: "April",
            5: "May", 6: "June", 7: "July", 8: "August",
            9: "September", 10: "October", 11: "November", 12: "December"
        }
        return month_names.get(self.month, str(self.month))


class TextWidget(models.Model):
    """Model for text widgets"""
    title = models.ForeignKey(
        LocalizedElement, 
        on_delete=models.CASCADE,
        related_name='widget_titles',
        help_text="Localized widget title"
    )
    content = models.ForeignKey(
        LocalizedElement, 
        on_delete=models.CASCADE,
        related_name='widget_contents',
        help_text="Localized widget content"
    )
    image = models.ImageField(
        upload_to='widget_images/', 
        blank=True, 
        null=True, 
        help_text="Widget image"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'title__english']
        verbose_name = "Text Widget"
        verbose_name_plural = "Text Widgets"
    
    def __str__(self):
        return self.title.english
    
    @property
    def image_url(self):
        """Return the image URL if available"""
        if self.image and hasattr(self.image, 'url'):
            try:
                if hasattr(settings, 'BASE_URL') and settings.BASE_URL:
                    return f"{settings.BASE_URL}{self.image.url}"
                return self.image.url
            except (ValueError, AttributeError):
                return None
        return None


class Newsletter(models.Model):
    """Model for newsletter articles"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=500, help_text="Brief description for previews")
    featured_image = models.ImageField(upload_to='newsletter_images/', blank=True, null=True, help_text="Featured image for newsletter")
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='newsletters',
        help_text="Primary category for this newsletter"
    )
    tags = models.ManyToManyField(
        Tag, 
        blank=True,
        related_name='newsletters',
        help_text="Tags for this newsletter"
    )
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
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='podcast_episodes',
        help_text="Primary category for this episode"
    )
    tags = models.ManyToManyField(
        Tag, 
        blank=True,
        related_name='podcast_episodes',
        help_text="Tags for this episode"
    )
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


class Comment(models.Model):
    """Model for user comments on podcast episodes and newsletters"""
    content = models.TextField(
        max_length=2000,
        help_text="Comment content (max 2000 characters)"
    )
    author_name = models.CharField(
        max_length=100,
        help_text="Author's display name"
    )
    author_email = models.EmailField(
        help_text="Author's email address"
    )
    author_website = models.URLField(
        blank=True,
        null=True,
        help_text="Author's website (optional)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether this comment has been approved for display"
    )
    
    # Foreign key relationships - only one should be set
    podcast_episode = models.ForeignKey(
        PodcastEpisode,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        help_text="Related podcast episode (if this is a podcast comment)"
    )
    newsletter = models.ForeignKey(
        Newsletter,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        help_text="Related newsletter (if this is a newsletter comment)"
    )
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        # Ensure only one relationship is set
        constraints = [
            models.CheckConstraint(
                check=models.Q(podcast_episode__isnull=False, newsletter__isnull=True) |
                       models.Q(podcast_episode__isnull=True, newsletter__isnull=False),
                name='comment_must_belong_to_one_content_type'
            )
        ]
    
    def __str__(self):
        content_type = "Podcast" if self.podcast_episode else "Newsletter"
        content_title = self.podcast_episode.title if self.podcast_episode else self.newsletter.title
        return f"Comment by {self.author_name} on {content_type}: {content_title}"
    
    def clean(self):
        """Custom validation"""
        from django.core.exceptions import ValidationError
        
        # Ensure exactly one relationship is set
        if bool(self.podcast_episode) == bool(self.newsletter):
            raise ValidationError("Comment must be associated with either a podcast episode or newsletter, but not both or neither.")
        
        # Validate content length
        if len(self.content.strip()) < 10:
            raise ValidationError("Comment must be at least 10 characters long.")
        
        # Validate author name
        if len(self.author_name.strip()) < 2:
            raise ValidationError("Author name must be at least 2 characters long.")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Run validation before saving
        super().save(*args, **kwargs)