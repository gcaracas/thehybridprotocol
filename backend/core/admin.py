from django.contrib import admin
from django.utils.html import format_html
from .models import Newsletter, PodcastEpisode, EmailSignup


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'published', 'published_at', 'created_at']
    list_filter = ['published', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'slug']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published']
    date_hierarchy = 'published_at'
    actions = ['delete_selected']
    list_per_page = 25
    
    def get_actions(self, request):
        """Enable delete action for maximum control"""
        actions = super().get_actions(request)
        return actions


@admin.register(PodcastEpisode)
class PodcastEpisodeAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'publish_date', 'episode_number', 'published', 'cover_image_preview']
    list_filter = ['published', 'publish_date']
    search_fields = ['title', 'description', 'slug', 'episode_number']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['published']
    date_hierarchy = 'publish_date'
    actions = ['delete_selected']
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'episode_number', 'publish_date', 'published')
        }),
        ('Content', {
            'fields': ('script',),
            'classes': ('wide',)
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
