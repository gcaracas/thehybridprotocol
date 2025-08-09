from rest_framework import serializers
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import Newsletter, PodcastEpisode, EmailSignup, Category, Tag, Archive, Comment, TextWidget


class NewsletterSerializer(serializers.ModelSerializer):
    """Serializer for Newsletter model"""
    featured_image_url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Newsletter
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 
            'featured_image', 'featured_image_url', 'published', 'available_in_english', 
            'available_in_spanish', 'available_languages', 'is_multilingual', 'created_at', 
            'updated_at', 'published_at', 'category', 'tags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'published_at', 'featured_image_url', 'available_languages', 'is_multilingual']
    
    def get_featured_image_url(self, obj):
        """Return full absolute URL for featured image"""
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url:
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
                'count': obj.category.actual_count,
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
            'featured_image_url', 'published_at', 'available_in_english', 
            'available_in_spanish', 'available_languages', 'is_multilingual', 'category', 'tags'
        ]
    
    def get_featured_image_url(self, obj):
        """Return full absolute URL for featured image"""
        if obj.featured_image and hasattr(obj.featured_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url:
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
                'count': obj.category.actual_count,
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
            'facebook_url', 'youtube_url', 'spotify_url',
            'cover_image', 'cover_image_url', 'published', 'available_in_english', 
            'available_in_spanish', 'available_languages', 'is_multilingual',
            'created_at', 'updated_at', 'category', 'tags'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'cover_image_url', 'available_languages', 'is_multilingual']
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url:
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
                'count': obj.category.actual_count,
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
            'episode_number', 'duration', 'facebook_url', 'youtube_url', 
            'spotify_url', 'cover_image_url', 'script_snippet', 'available_in_english', 
            'available_in_spanish', 'available_languages', 'is_multilingual', 'category', 'tags'
        ]
    
    def get_cover_image_url(self, obj):
        """Return full absolute URL for cover image"""
        if obj.cover_image and hasattr(obj.cover_image, 'url'):
            try:
                # Use BASE_URL from settings for reliable absolute URLs
                base_url = getattr(settings, 'BASE_URL', None)
                if base_url:
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
                'count': obj.category.actual_count,
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
    """Serializer for creating email signups (public endpoint) with enhanced security"""
    
    class Meta:
        model = EmailSignup
        fields = ['email', 'source']
    
    def validate_email(self, value):
        """Validate email format and uniqueness"""
        email = value.strip().lower()
        
        # Check for duplicate email
        if EmailSignup.objects.filter(email=email).exists():
            raise serializers.ValidationError("This email is already subscribed.")
        
        # Additional email validation
        if len(email) > 254:  # RFC 5321 limit
            raise serializers.ValidationError("Email address is too long.")
        
        return email
    
    def validate_source(self, value):
        """Validate source field"""
        source = value.strip()
        allowed_sources = ['home', 'newsletter', 'website']
        if source not in allowed_sources:
            raise serializers.ValidationError("Invalid source specified.")
        return source
    
    def validate(self, data):
        """Additional validation"""
        # Rate limiting check (basic)
        email = data.get('email')
        if email:
            # Check for recent submissions from same email
            recent_submissions = EmailSignup.objects.filter(
                email=email,
                created_at__gte=timezone.now() - timedelta(minutes=1)
            ).count()
            if recent_submissions > 0:
                raise serializers.ValidationError("Please wait a moment before submitting again.")
        
        return data


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    name_english = serializers.CharField(source='name.english', read_only=True)
    name_spanish = serializers.CharField(source='name.spanish', read_only=True)
    count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name_english', 'name_spanish', 'slug', 
            'count', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_count(self, obj):
        """Return the actual calculated count of items in this category"""
        return obj.actual_count


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


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    
    class Meta:
        model = Comment
        fields = [
            'id', 'content', 'author_name', 'author_email', 'author_website',
            'created_at', 'is_approved'
        ]
        read_only_fields = ['id', 'created_at', 'is_approved']


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments with enhanced security"""
    
    class Meta:
        model = Comment
        fields = [
            'content', 'author_name', 'author_email', 'author_website',
            'podcast_episode', 'newsletter'
        ]
    
    def validate_content(self, value):
        """Validate comment content"""
        content = value.strip()
        if len(content) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters long.")
        if len(content) > 2000:
            raise serializers.ValidationError("Comment cannot exceed 2000 characters.")
        return content
    
    def validate_author_name(self, value):
        """Validate author name"""
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(name) > 100:
            raise serializers.ValidationError("Name cannot exceed 100 characters.")
        return name
    
    def validate_author_email(self, value):
        """Validate email format"""
        email = value.strip().lower()
        # Django's EmailField already validates format
        return email
    
    def validate_author_website(self, value):
        """Validate website URL if provided"""
        if value:
            website = value.strip()
            if not website.startswith(('http://', 'https://')):
                website = 'https://' + website
            return website
        return value
    
    def validate(self, data):
        """Ensure exactly one relationship is set"""
        podcast_episode = data.get('podcast_episode')
        newsletter = data.get('newsletter')
        
        if bool(podcast_episode) == bool(newsletter):
            raise serializers.ValidationError(
                "Comment must be associated with either a podcast episode or newsletter, but not both or neither."
            )
        
        return data
    
    def create(self, validated_data):
        """Create comment with additional security measures"""
        # Sanitize inputs
        validated_data['content'] = validated_data['content'].strip()
        validated_data['author_name'] = validated_data['author_name'].strip()
        validated_data['author_email'] = validated_data['author_email'].strip().lower()
        
        if validated_data.get('author_website'):
            validated_data['author_website'] = validated_data['author_website'].strip()
        
        # Create comment (approval will be handled by admin)
        return super().create(validated_data) 


class TextWidgetSerializer(serializers.ModelSerializer):
    """Serializer for TextWidget model"""
    title_english = serializers.CharField(source='title.english', read_only=True)
    title_spanish = serializers.CharField(source='title.spanish', read_only=True)
    content_english = serializers.CharField(source='content.english', read_only=True)
    content_spanish = serializers.CharField(source='content.spanish', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TextWidget
        fields = [
            'id', 'title_english', 'title_spanish', 'content_english', 'content_spanish',
            'image_url', 'is_active', 'order', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        """Return the image URL if available"""
        return obj.image_url 