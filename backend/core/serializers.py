from rest_framework import serializers
from django.conf import settings
from .models import Newsletter, PodcastEpisode, EmailSignup


class NewsletterSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter model"""
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 
            'featured_image', 'published', 'created_at', 
            'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at']


class NewsletterListSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter list view (minimal fields)"""
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'slug', 'excerpt', 
            'featured_image', 'published_at'
        ]


class PodcastEpisodeSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode model - includes script for detail view"""
    cover_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'script', 
            'publish_date', 'episode_number', 'duration', 
            'audio_url', 'youtube_url', 'spotify_url',
            'cover_image', 'cover_image_url', 'published', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'cover_image_url']
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
                return f"{base_url}{obj.cover_image.url}"
            except (ValueError, AttributeError):
                return None
        return None


class PodcastEpisodeListSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode list view (minimal fields, with script snippet)"""
    cover_image_url = serializers.SerializerMethodField()
    script_snippet = serializers.SerializerMethodField()
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'publish_date',
            'episode_number', 'duration', 'audio_url', 'youtube_url', 
            'spotify_url', 'cover_image_url', 'script_snippet'
        ]
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', 'http://localhost:8000')
                return f"{base_url}{obj.cover_image.url}"
            except (ValueError, AttributeError):
                return None
        return None
    
    def get_script_snippet(self, obj):
        """Return first 200 characters of script"""
        if obj.script:
            return obj.script[:200] + "..." if len(obj.script) > 200 else obj.script
        return ""


class EmailSignupSerializer(serializers.ModelSerializer):
    """Serializer for EmailSignup model"""
    
    class Meta:
        model = EmailSignup
        fields = [
            'id', 'email', 'first_name', 'last_name', 
            'source', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if EmailSignup.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value


class EmailSignupCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating email signups (public endpoint)"""
    
    class Meta:
        model = EmailSignup
        fields = ['email', 'first_name', 'last_name', 'source']
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        if EmailSignup.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        return value