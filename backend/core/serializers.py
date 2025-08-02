from rest_framework import serializers
from django.conf import settings
from .models import Newsletter, PodcastEpisode, EmailSignup, Category, Tag, Archive


class NewsletterSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter model"""
    featured_image_url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 
            'featured_image', 'featured_image_url', 'published', 'created_at', 
            'updated_at', 'published_at', 'category', 'tags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at', 'featured_image_url']
    
    def get_featured_image_url(self, obj):
        """Return full absolute URL for featured image"""
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url and base_url != 'http://localhost:8000':
                    return f"{base_url}{obj.featured_image.url}"
                return obj.featured_image.url
            except (ValueError, AttributeError):
                return None
        return None
    
    def get_category(self, obj):
        """Return category data"""
        if obj.category:
            return {
                'id': obj.category.id,
                'name_english': obj.category.name.english,
                'name_spanish': obj.category.name.spanish,
                'slug': obj.category.slug,
                'count': obj.category.count,
                'is_active': obj.category.is_active
            }
        return None
    
    def get_tags(self, obj):
        """Return tags data"""
        if obj.tags.exists():
            return [{
                'id': tag.id,
                'name_english': tag.name.english,
                'name_spanish': tag.name.spanish,
                'slug': tag.slug,
                'is_active': tag.is_active
            } for tag in obj.tags.all()]
        return []


class NewsletterListSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter list view (minimal fields)"""
    featured_image_url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'slug', 'excerpt', 
            'featured_image_url', 'published_at', 'category', 'tags'
        ]
    
    def get_featured_image_url(self, obj):
        """Return full absolute URL for featured image"""
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url and base_url != 'http://localhost:8000':
                    return f"{base_url}{obj.featured_image.url}"
                return obj.featured_image.url
            except (ValueError, AttributeError):
                return None
        return None
    
    def get_category(self, obj):
        """Return category data"""
        if obj.category:
            return {
                'id': obj.category.id,
                'name_english': obj.category.name.english,
                'name_spanish': obj.category.name.spanish,
                'slug': obj.category.slug,
                'count': obj.category.count,
                'is_active': obj.category.is_active
            }
        return None
    
    def get_tags(self, obj):
        """Return tags data"""
        if obj.tags.exists():
            return [{
                'id': tag.id,
                'name_english': tag.name.english,
                'name_spanish': tag.name.spanish,
                'slug': tag.slug,
                'is_active': tag.is_active
            } for tag in obj.tags.all()]
        return []


class PodcastEpisodeSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode model - includes script for detail view"""
    cover_image_url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'script', 
            'publish_date', 'episode_number', 'duration', 
            'audio_url', 'youtube_url', 'spotify_url',
            'cover_image', 'cover_image_url', 'published', 
            'created_at', 'updated_at', 'category', 'tags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'cover_image_url']
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url and base_url != 'http://localhost:8000':
                    return f"{base_url}{obj.cover_image.url}"
                return obj.cover_image.url
            except (ValueError, AttributeError):
                return None
        return None
    
    def get_category(self, obj):
        """Return category data"""
        if obj.category:
            return {
                'id': obj.category.id,
                'name_english': obj.category.name.english,
                'name_spanish': obj.category.name.spanish,
                'slug': obj.category.slug,
                'count': obj.category.count,
                'is_active': obj.category.is_active
            }
        return None
    
    def get_tags(self, obj):
        """Return tags data"""
        if obj.tags.exists():
            return [{
                'id': tag.id,
                'name_english': tag.name.english,
                'name_spanish': tag.name.spanish,
                'slug': tag.slug,
                'is_active': tag.is_active
            } for tag in obj.tags.all()]
        return []


class PodcastEpisodeListSerializer(serializers.ModelSerializer):
    """Serializer for PodcastEpisode list view (minimal fields, with script snippet)"""
    cover_image_url = serializers.SerializerMethodField()
    script_snippet = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = PodcastEpisode
        fields = [
            'id', 'title', 'slug', 'description', 'publish_date',
            'episode_number', 'duration', 'audio_url', 'youtube_url', 
            'spotify_url', 'cover_image_url', 'script_snippet', 'category', 'tags'
        ]
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url and base_url != 'http://localhost:8000':
                    return f"{base_url}{obj.cover_image.url}"
                return obj.cover_image.url
            except (ValueError, AttributeError):
                return None
        return None
    
    def get_script_snippet(self, obj):
        """Return first 200 characters of script"""
        if obj.script:
            return obj.script[:200] + "..." if len(obj.script) > 200 else obj.script
        return ""
    
    def get_category(self, obj):
        """Return category data"""
        if obj.category:
            return {
                'id': obj.category.id,
                'name_english': obj.category.name.english,
                'name_spanish': obj.category.name.spanish,
                'slug': obj.category.slug,
                'count': obj.category.count,
                'is_active': obj.category.is_active
            }
        return None
    
    def get_tags(self, obj):
        """Return tags data"""
        if obj.tags.exists():
            return [{
                'id': tag.id,
                'name_english': tag.name.english,
                'name_spanish': tag.name.spanish,
                'slug': tag.slug,
                'is_active': tag.is_active
            } for tag in obj.tags.all()]
        return []


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


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    name_english = serializers.CharField(source='name.english', read_only=True)
    name_spanish = serializers.CharField(source='name.spanish', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name_english', 'name_spanish', 'slug', 
            'count', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    name_english = serializers.CharField(source='name.english', read_only=True)
    name_spanish = serializers.CharField(source='name.spanish', read_only=True)
    
    class Meta:
        model = Tag
        fields = [
            'id', 'name_english', 'name_spanish', 'slug', 
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ArchiveSerializer(serializers.ModelSerializer):
    """Serializer for Archive model"""
    month_name = serializers.CharField(source='get_month_display', read_only=True)
    
    class Meta:
        model = Archive
        fields = [
            'id', 'month', 'month_name', 'year', 'count', 
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at'] 