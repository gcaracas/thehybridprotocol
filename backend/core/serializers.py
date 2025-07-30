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
    """Serializer for PodcastEpisode model"""
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'episode_number',
            'duration', 'audio_url', 'youtube_url', 'spotify_url',
            'apple_url', 'thumbnail', 'published', 'created_at',
            'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at']


class PodcastEpisodeListSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode list view (minimal fields)"""
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'episode_number', 'duration',
            'youtube_url', 'thumbnail', 'published_at'
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