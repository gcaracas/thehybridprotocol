from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    # Health check and API info
    path('health/', views.health_check, name='health_check'),
    path('media-debug/', views.media_debug, name='media_debug'),
    path('', views.api_info, name='api_info'),
    
    # Newsletter endpoints
    path('newsletters/', views.NewsletterListView.as_view(), name='newsletter_list'),
    path('newsletters/<slug:slug>/', views.NewsletterDetailView.as_view(), name='newsletter_detail'),
    
    # Podcast endpoints
    path('podcast-episodes/', views.PodcastEpisodeListView.as_view(), name='podcast_episodes_list'),
    path('podcast-episodes/<slug:slug>/', views.PodcastEpisodeDetailView.as_view(), name='podcast_episodes_detail'),
    
    # Simplified podcast endpoints (as requested)
    path('podcast/', views.PodcastEpisodeListView.as_view(), name='podcast_list'),
    path('podcast/<slug:slug>/', views.PodcastEpisodeDetailView.as_view(), name='podcast_detail'),
    
    # Email signup endpoint
    path('email-signup/', views.EmailSignupCreateView.as_view(), name='email_signup'),
    
    # Category, Tag, and Archive endpoints
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('tags/', views.TagListView.as_view(), name='tag_list'),
    path('archives/', views.ArchiveListView.as_view(), name='archive_list'),
    
    # Comment endpoints
    path('comments/', views.CommentListView.as_view(), name='comment_list'),
    path('comments/create/', views.CommentCreateView.as_view(), name='comment_create'),
]