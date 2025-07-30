from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
import os
from .models import Newsletter, PodcastEpisode, EmailSignup
from .serializers import (
    NewsletterSerializer, NewsletterListSerializer,
    PodcastEpisodeSerializer, PodcastEpisodeListSerializer,
    EmailSignupSerializer, EmailSignupCreateSerializer
)


class NewsletterListView(generics.ListAPIView):
    """List all published newsletter articles"""
    serializer_class = NewsletterListSerializer
    
    def get_queryset(self):
        return Newsletter.objects.filter(published=True)


class NewsletterDetailView(generics.RetrieveAPIView):
    """Retrieve a single newsletter article by slug"""
    serializer_class = NewsletterSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Newsletter.objects.filter(published=True)


class PodcastEpisodeListView(generics.ListAPIView):
    """List all published podcast episodes"""
    serializer_class = PodcastEpisodeListSerializer
    
    def get_queryset(self):
        return PodcastEpisode.objects.filter(published=True)


class PodcastEpisodeDetailView(generics.RetrieveAPIView):
    """Retrieve a single podcast episode by slug"""
    serializer_class = PodcastEpisodeSerializer
    lookup_field = 'slug'
    
    def get_queryset(self):
        return PodcastEpisode.objects.filter(published=True)


class EmailSignupCreateView(generics.CreateAPIView):
    """Create a new email signup"""
    serializer_class = EmailSignupCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully subscribed to newsletter!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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