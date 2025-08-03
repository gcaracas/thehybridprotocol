from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
import os
from .models import Newsletter, PodcastEpisode, EmailSignup, Category, Tag, Archive
from .serializers import (
    NewsletterSerializer, NewsletterListSerializer,
    PodcastEpisodeSerializer, PodcastEpisodeListSerializer,
    EmailSignupSerializer, EmailSignupCreateSerializer,
    CategorySerializer, TagSerializer, ArchiveSerializer
)
from rest_framework.decorators import throttle_classes
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from .serializers import CommentSerializer, CommentCreateSerializer
from .models import Comment


class NewsletterListView(generics.ListAPIView):
    """List all published newsletter articles with optional language filtering"""
    serializer_class = NewsletterListSerializer
    pagination_class = None  # We'll handle pagination manually
    
    def get_queryset(self):
        queryset = Newsletter.objects.filter(published=True)
        
        # Filter by language if specified
        language = self.request.query_params.get('language', '').lower()
        if language == 'english':
            queryset = queryset.filter(available_in_english=True)
        elif language == 'spanish':
            queryset = queryset.filter(available_in_spanish=True)
        elif language == 'both':
            queryset = queryset.filter(available_in_english=True, available_in_spanish=True)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Get pagination parameters
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 6))
        
        # Calculate pagination
        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        
        # Get paginated data
        paginated_queryset = queryset[start:end]
        
        # Serialize the data
        serializer = self.get_serializer(paginated_queryset, many=True)
        
        # Return paginated response
        return Response({
            'count': total_count,
            'next': f"?page={page + 1}&page_size={page_size}" if end < total_count else None,
            'previous': f"?page={page - 1}&page_size={page_size}" if page > 1 else None,
            'results': serializer.data
        })


class NewsletterDetailView(generics.RetrieveAPIView):
    """Retrieve a single newsletter article by slug"""
    serializer_class = NewsletterSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Newsletter.objects.filter(published=True)


class PodcastEpisodeListView(generics.ListAPIView):
    """List all published podcast episodes with optional language filtering"""
    serializer_class = PodcastEpisodeListSerializer
    pagination_class = None  # We'll handle pagination manually
    
    def get_queryset(self):
        queryset = PodcastEpisode.objects.filter(published=True)
        
        # Filter by language if specified
        language = self.request.query_params.get('language', '').lower()
        if language == 'english':
            queryset = queryset.filter(available_in_english=True)
        elif language == 'spanish':
            queryset = queryset.filter(available_in_spanish=True)
        elif language == 'both':
            queryset = queryset.filter(available_in_english=True, available_in_spanish=True)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Get pagination parameters
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 6))
        
        # Calculate pagination
        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        
        # Get paginated data
        paginated_queryset = queryset[start:end]
        
        # Serialize the data
        serializer = self.get_serializer(paginated_queryset, many=True)
        
        # Return paginated response
        return Response({
            'count': total_count,
            'next': f"?page={page + 1}&page_size={page_size}" if end < total_count else None,
            'previous': f"?page={page - 1}&page_size={page_size}" if page > 1 else None,
            'results': serializer.data
        })


class PodcastEpisodeDetailView(generics.RetrieveAPIView):
    """Retrieve a single podcast episode by slug"""
    serializer_class = PodcastEpisodeSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return PodcastEpisode.objects.filter(published=True)


class EmailSignupCreateView(generics.CreateAPIView):
    """Create a new email signup with rate limiting and security"""
    serializer_class = EmailSignupCreateSerializer
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    
    def get_throttles(self):
        """Disable throttling during tests"""
        if settings.DEBUG and 'test' in str(self.request):
            return []
        return super().get_throttles()
    
    def get_client_ip(self):
        """Get client IP address for rate limiting"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully subscribed to newsletter!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryListView(generics.ListAPIView):
    """List all active categories"""
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        return Category.objects.filter(is_active=True)


class TagListView(generics.ListAPIView):
    """List all active tags"""
    serializer_class = TagSerializer
    
    def get_queryset(self):
        return Tag.objects.filter(is_active=True)


class ArchiveListView(generics.ListAPIView):
    """List all active archives"""
    serializer_class = ArchiveSerializer
    
    def get_queryset(self):
        return Archive.objects.filter(is_active=True)


class CommentListView(generics.ListAPIView):
    """List comments for a specific podcast or newsletter"""
    serializer_class = CommentSerializer
    
    def get_queryset(self):
        """Get approved comments for the specified content"""
        content_type = self.request.query_params.get('content_type')
        content_id = self.request.query_params.get('content_id')
        
        if not content_type or not content_id:
            return Comment.objects.none()
        
        queryset = Comment.objects.filter(is_approved=True)
        
        if content_type == 'podcast':
            queryset = queryset.filter(podcast_episode_id=content_id)
        elif content_type == 'newsletter':
            queryset = queryset.filter(newsletter_id=content_id)
        else:
            return Comment.objects.none()
        
        return queryset.order_by('-created_at')


class CommentCreateView(generics.CreateAPIView):
    """Create a new comment with rate limiting and security"""
    serializer_class = CommentCreateSerializer
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    
    def perform_create(self, serializer):
        """Create comment with additional security checks"""
        # Rate limiting check (additional to DRF throttling)
        client_ip = self.get_client_ip()
        cache_key = f"comment_rate_limit:{client_ip}"
        
        # Check if user has commented recently (max 1 comment per 5 minutes)
        recent_comments = cache.get(cache_key, 0)
        if recent_comments >= 1:
            raise serializers.ValidationError(
                "You can only submit one comment every 5 minutes. Please wait before submitting another comment."
            )
        
        # Create the comment
        comment = serializer.save()
        
        # Update rate limiting cache
        cache.set(cache_key, recent_comments + 1, 300)  # 5 minutes
        
        return comment
    
    def get_client_ip(self):
        """Get client IP address for rate limiting"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'The Hybrid Protocol API is running'
    })


@api_view(['GET'])
def api_info(request):
    """API information endpoint"""
    return JsonResponse({
        'name': 'The Hybrid Protocol API',
        'version': '1.0.0',
        'endpoints': {
            'newsletters': '/api/newsletters/',
            'newsletter_detail': '/api/newsletters/{slug}/',
            'podcast_episodes': '/api/podcast-episodes/',
            'podcast_detail': '/api/podcast-episodes/{slug}/',
            'email_signup': '/api/email-signup/',
            'health': '/api/health/',
            'media_debug': '/api/media-debug/',
        }
    })


@api_view(['GET'])
def media_debug(request):
    """Debug endpoint to check media directory status"""
    
    media_root = settings.MEDIA_ROOT
    media_url = settings.MEDIA_URL
    
    debug_info = {
        'media_root': media_root,
        'media_url': media_url,
        'media_exists': os.path.exists(media_root),
        'media_writable': os.access(media_root, os.W_OK) if os.path.exists(media_root) else False,
        'media_contents': [],
        'permissions': None,
        'error': None
    }
    
    try:
        if os.path.exists(media_root):
            debug_info['media_contents'] = os.listdir(media_root)
            stat_info = os.stat(media_root)
            debug_info['permissions'] = oct(stat_info.st_mode)[-3:]
            
            # Check podcast_covers subdirectory
            podcast_covers_dir = os.path.join(media_root, 'podcast_covers')
            if os.path.exists(podcast_covers_dir):
                debug_info['podcast_covers_contents'] = os.listdir(podcast_covers_dir)
            else:
                debug_info['podcast_covers_contents'] = 'Directory does not exist'
        else:
            debug_info['error'] = 'Media directory does not exist'
            
    except Exception as e:
        debug_info['error'] = str(e)
    
    return JsonResponse(debug_info)