from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse, path
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.shortcuts import render
from .models import (
    Newsletter, PodcastEpisode, EmailSignup,
    LocalizedElement, Category, Tag, Archive, TextWidget, Comment, EmailLog
)
from .tasks import send_newsletter_task, send_test_newsletter_task
import re


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'status', 'published', 'available_in_english', 'available_in_spanish', 'sent_at', 'published_at', 'featured_image_preview', 'preview_link', 'created_at']
    list_filter = ['status', 'published', 'category', 'tags', 'available_in_english', 'available_in_spanish', 'created_at', 'published_at', 'sent_at']
    search_fields = ['title', 'subject', 'content', 'slug', 'category__name__english', 'tags__name__english']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['status', 'published', 'available_in_english', 'available_in_spanish']
    date_hierarchy = 'published_at'
    actions = ['delete_selected', 'send_newsletter', 'send_test_newsletter']
    list_per_page = 25
    readonly_fields = ['send_key', 'sent_at', 'created_at', 'updated_at', 'published_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'subject', 'preheader', 'excerpt', 'status', 'published')
        }),
        ('Content', {
            'fields': ('content',),
            'classes': ('wide',)
        }),
        ('Language Availability', {
            'fields': ('available_in_english', 'available_in_spanish'),
            'description': 'Select which languages this content is available in. Both can be selected.'
        }),
        ('Categorization', {
            'fields': ('category', 'tags'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Sending Information', {
            'fields': ('send_key', 'sent_at'),
            'classes': ('collapse',)
        }),
    )
    
    def featured_image_preview(self, obj):
        """Display a thumbnail preview of the featured image in the admin list view"""
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">',
                obj.featured_image.url
            )
        return "No image"
    featured_image_preview.short_description = "Image"

    def preview_link(self, obj):
        """Display preview link"""
        if obj.pk:
            preview_url = reverse('admin:core_newsletter_preview', args=[obj.pk])
            return format_html('<a href="{}" target="_blank">Preview</a>', preview_url)
        return "N/A"
    preview_link.short_description = "Preview"
    
    def languages_display(self, obj):
        """Display available languages"""
        languages = []
        if obj.available_in_english:
            languages.append('EN')
        if obj.available_in_spanish:
            languages.append('ES')
        return ', '.join(languages) if languages else 'None'
    languages_display.short_description = "Languages"
    
    def send_newsletter(self, request, queryset):
        """Admin action to send newsletter"""
        if queryset.count() != 1:
            messages.error(request, "Please select exactly one newsletter to send.")
            return
        
        newsletter = queryset.first()
        
        if newsletter.status != 'published':
            messages.error(request, "Only published newsletters can be sent.")
            return
        
        if newsletter.sent_at:
            messages.warning(request, "This newsletter has already been sent.")
            return
        
        # Queue the task
        send_newsletter_task.delay(newsletter.send_key)
        messages.success(request, f"Newsletter '{newsletter.title}' has been queued for sending.")
    
    send_newsletter.short_description = "Send newsletter to subscribers"
    
    def send_test_newsletter(self, request, queryset):
        """Admin action to send test newsletter"""
        if queryset.count() != 1:
            messages.error(request, "Please select exactly one newsletter for testing.")
            return
        
        newsletter = queryset.first()
        
        # Get admin user's email for test
        admin_email = request.user.email
        if not admin_email:
            messages.error(request, "Please set your email address in your user profile to send test emails.")
            return
        
        # Queue test email task
        send_test_newsletter_task.delay(newsletter.id, admin_email)
        messages.success(request, f"Test newsletter '{newsletter.title}' has been queued for sending to {admin_email}.")
    
    send_test_newsletter.short_description = "Send test newsletter to admin"

    def get_urls(self):
        """Add custom URLs for admin actions"""
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:newsletter_id>/preview/',
                self.admin_site.admin_view(self.preview_newsletter),
                name='core_newsletter_preview',
            ),
        ]
        return custom_urls + urls

    def preview_newsletter(self, request, newsletter_id):
        """Preview newsletter in admin"""
        newsletter = self.get_object(request, newsletter_id)
        if newsletter is None:
            messages.error(request, "Newsletter not found.")
            return HttpResponseRedirect(reverse('admin:core_newsletter_changelist'))
        
        # Create dummy unsubscribe and view URLs for preview
        dummy_unsub = "#preview-unsubscribe"
        dummy_view = f"{settings.PUBLIC_FRONTEND_URL}{settings.NEWSLETTER_VIEW_PATH}/{newsletter.slug}"
        
        # Convert content to HTML if needed
        if newsletter.content:
            from .utils.email import convert_markdown_to_html
            content_html = convert_markdown_to_html(newsletter.content)
        else:
            content_html = ""
        
        context = {
            'newsletter': newsletter,
            'subject': newsletter.subject,
            'preheader': newsletter.preheader,
            'content_html': content_html,
            'UNSUB': dummy_unsub,
            'VIEW_URL': dummy_view,
            'PUBLIC_FRONTEND_URL': settings.PUBLIC_FRONTEND_URL,
        }
        
        return render(request, 'email/newsletter.html', context)


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['newsletter', 'recipient', 'status', 'provider_message_id', 'created_at']
    list_filter = ['status', 'created_at', 'newsletter']
    search_fields = ['newsletter__title', 'recipient__email', 'provider_message_id']
    readonly_fields = ['newsletter', 'recipient', 'status', 'provider_message_id', 'error', 'created_at']
    date_hierarchy = 'created_at'
    list_per_page = 50
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


@admin.register(PodcastEpisode)
class PodcastEpisodeAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'category', 'publish_date', 'episode_number', 'published', 'available_in_english', 'available_in_spanish', 'languages_display', 'cover_image_preview']
    list_filter = ['published', 'category', 'tags', 'available_in_english', 'available_in_spanish', 'publish_date']
    search_fields = ['title', 'description', 'slug', 'episode_number', 'category__name__english', 'tags__name__english']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published', 'available_in_english', 'available_in_spanish']
    date_hierarchy = 'publish_date'
    actions = ['delete_selected']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'episode_number', 'publish_date', 'published')
        }),
        ('Language Availability', {
            'fields': ('available_in_english', 'available_in_spanish'),
            'description': 'Select which languages this content is available in. Both can be selected.'
        }),
        ('Content', {
            'fields': ('script',),
            'classes': ('wide',)
        }),
        ('Categorization', {
            'fields': ('category', 'tags'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('facebook_url', 'youtube_url', 'spotify_url', 'cover_image')
        }),
        ('Metadata', {
            'fields': ('duration',),
            'classes': ('collapse',)
        }),
    )
    
    def cover_image_preview(self, obj):
        """Display a thumbnail preview of the cover image in the admin list view"""
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">',
                obj.cover_image.url
            )
        return "No image"
    cover_image_preview.short_description = "Cover Image"
    
    def languages_display(self, obj):
        """Display available languages in a readable format"""
        languages = []
        if obj.available_in_english:
            languages.append('🇺🇸 EN')
        if obj.available_in_spanish:
            languages.append('🇪🇸 ES')
        return ' | '.join(languages) if languages else '—'
    languages_display.short_description = "Languages"


@admin.register(EmailSignup)
class EmailSignupAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'source', 'is_active', 'created_at', 'confirmed_at']
    list_filter = ['is_active', 'source', 'created_at', 'confirmed_at']
    search_fields = ['email', 'first_name', 'last_name', 'source']
    list_editable = ['is_active']
    readonly_fields = ['created_at', 'confirmed_at']
    date_hierarchy = 'created_at'
    actions = ['delete_selected', 'mark_inactive', 'mark_active']
    list_per_page = 50
    
    def mark_inactive(self, request, queryset):
        """Bulk action to mark selected signups as inactive"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f"Marked {updated} email signups as inactive.")
    mark_inactive.short_description = "Mark selected signups as inactive"
    
    def mark_active(self, request, queryset):
        """Bulk action to mark selected signups as active"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f"Marked {updated} email signups as active.")
    mark_active.short_description = "Mark selected signups as active"


@admin.register(LocalizedElement)
class LocalizedElementAdmin(admin.ModelAdmin):
    list_display = ['id', 'english_preview', 'spanish_preview', 'created_at']
    search_fields = ['english', 'spanish']
    list_per_page = 50
    
    def english_preview(self, obj):
        return obj.english[:50] + "..." if len(obj.english) > 50 else obj.english
    english_preview.short_description = "English"
    
    def spanish_preview(self, obj):
        return obj.spanish[:50] + "..." if len(obj.spanish) > 50 else obj.spanish
    spanish_preview.short_description = "Spanish"


def generate_slug(text):
    """Generate a URL-safe slug from text"""
    # Convert to lowercase
    slug = text.lower()
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Replace multiple hyphens with single hyphen
    slug = re.sub(r'-+', '-', slug)
    return slug


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_id', 'slug', 'count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name__english', 'name__spanish', 'slug']
    list_editable = ['count', 'is_active']
    list_per_page = 25
    
    def name_id(self, obj):
        """Show the LocalizedElement ID"""
        return obj.name.id if obj.name else None
    name_id.short_description = "LocalizedElement ID"
    
    def save_model(self, request, obj, form, change):
        """Auto-generate slug from English name if not provided"""
        if not obj.slug and obj.name:
            obj.slug = generate_slug(obj.name.english)
        super().save_model(request, obj, form, change)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_id', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name__english', 'name__spanish', 'slug']
    list_editable = ['is_active']
    list_per_page = 25
    
    def name_id(self, obj):
        """Show the LocalizedElement ID"""
        return obj.name.id if obj.name else None
    name_id.short_description = "LocalizedElement ID"
    
    def save_model(self, request, obj, form, change):
        """Auto-generate slug from English name if not provided"""
        if not obj.slug and obj.name:
            obj.slug = generate_slug(obj.name.english)
        super().save_model(request, obj, form, change)


@admin.register(Archive)
class ArchiveAdmin(admin.ModelAdmin):
    list_display = ['month', 'year', 'count', 'is_active', 'created_at']
    list_filter = ['is_active', 'year', 'month', 'created_at']
    search_fields = ['year', 'month']
    list_editable = ['count', 'is_active']
    list_per_page = 25
    
    def get_month_display(self, obj):
        month_names = {
            1: "January", 2: "February", 3: "March", 4: "April",
            5: "May", 6: "June", 7: "July", 8: "August",
            9: "September", 10: "October", 11: "November", 12: "December"
        }
        return month_names.get(obj.month, str(obj.month))
    get_month_display.short_description = "Month"


@admin.register(TextWidget)
class TextWidgetAdmin(admin.ModelAdmin):
    list_display = ['title_preview', 'content_preview', 'image_preview', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title__english', 'title__spanish', 'content__english', 'content__spanish']
    list_editable = ['order', 'is_active']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'content', 'order', 'is_active')
        }),
        ('Media', {
            'fields': ('image',)
        }),
    )
    
    def title_preview(self, obj):
        if obj.title:
            title = obj.title.english
            return title[:50] + "..." if len(title) > 50 else title
        return "No title"
    title_preview.short_description = "Title"
    
    def content_preview(self, obj):
        if obj.content:
            content = obj.content.english
            return content[:50] + "..." if len(content) > 50 else content
        return "No content"
    content_preview.short_description = "Content Preview"
    
    def image_preview(self, obj):
        """Display a thumbnail preview of the image in the admin list view"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">',
                obj.image.url
            )
        return "No image"
    image_preview.short_description = "Image"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model"""
    list_display = [
        'author_name', 'content_preview', 'content_type', 'content_title',
        'created_at', 'is_approved'
    ]
    list_filter = [
        'is_approved', 'created_at', 'podcast_episode', 'newsletter'
    ]
    search_fields = [
        'author_name', 'author_email', 'content', 'podcast_episode__title', 'newsletter__title'
    ]
    readonly_fields = ['created_at']
    list_editable = ['is_approved']
    actions = ['approve_comments', 'reject_comments']
    
    fieldsets = (
        ('Comment Information', {
            'fields': ('content', 'author_name', 'author_email', 'author_website')
        }),
        ('Content Association', {
            'fields': ('podcast_episode', 'newsletter'),
            'description': 'Comment must be associated with either a podcast episode or newsletter'
        }),
        ('Moderation', {
            'fields': ('is_approved', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """Show first 50 characters of comment content"""
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "Content Preview"
    
    def content_type(self, obj):
        """Show whether comment is for podcast or newsletter"""
        return "Podcast" if obj.podcast_episode else "Newsletter"
    content_type.short_description = "Content Type"
    
    def content_title(self, obj):
        """Show the title of the associated content"""
        if obj.podcast_episode:
            return obj.podcast_episode.title
        elif obj.newsletter:
            return obj.newsletter.title
        return "Unknown"
    content_title.short_description = "Content Title"
    
    def approve_comments(self, request, queryset):
        """Approve selected comments"""
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} comment(s) were successfully approved.")
    approve_comments.short_description = "Approve selected comments"
    
    def reject_comments(self, request, queryset):
        """Reject selected comments"""
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} comment(s) were successfully rejected.")
    reject_comments.short_description = "Reject selected comments"
    
    def get_queryset(self, request):
        """Show most recent comments first"""
        return super().get_queryset(request).select_related('podcast_episode', 'newsletter')
