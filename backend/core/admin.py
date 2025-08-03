from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Newsletter, PodcastEpisode, EmailSignup,
    LocalizedElement, Category, Tag, Archive, TextWidget, Comment
)
import re


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'category', 'published', 'available_in_english', 'available_in_spanish', 'languages_display', 'published_at', 'featured_image_preview', 'created_at']
    list_filter = ['published', 'category', 'tags', 'available_in_english', 'available_in_spanish', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'slug', 'category__name__english', 'tags__name__english']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published', 'available_in_english', 'available_in_spanish']
    date_hierarchy = 'published_at'
    actions = ['delete_selected']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'published')
        }),
        ('Language Availability', {
            'fields': ('available_in_english', 'available_in_spanish'),
            'description': 'Select which languages this content is available in. Both can be selected.'
        }),
        ('Content', {
            'fields': ('content',),
            'classes': ('wide',)
        }),
        ('Categorization', {
            'fields': ('category', 'tags'),
            'classes': ('collapse',)
        }),
        ('Media', {
            'fields': ('featured_image',)
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
    featured_image_preview.short_description = "Featured Image"
    
    def languages_display(self, obj):
        """Display available languages in a readable format"""
        languages = []
        if obj.available_in_english:
            languages.append('🇺🇸 EN')
        if obj.available_in_spanish:
            languages.append('🇪🇸 ES')
        return ' | '.join(languages) if languages else '—'
    languages_display.short_description = "Languages"
    
    def get_actions(self, request):
        """Enable delete action for maximum control"""
        actions = super().get_actions(request)
        return actions


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
            'fields': ('audio_url', 'youtube_url', 'spotify_url', 'cover_image')
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
