from rest_framework import serializers
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
    cover_image_url = serializers.ReadOnlyField()
    
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


class PodcastEpisodeListSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode list view (minimal fields, no script)"""
    cover_image_url = serializers.ReadOnlyField()
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'publish_date',
            'episode_number', 'duration', 'audio_url', 'youtube_url', 
            'spotify_url', 'cover_image_url'
        ]


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