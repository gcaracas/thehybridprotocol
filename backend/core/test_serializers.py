from django.test import TestCase
from rest_framework.test import APITestCase
from .models import Newsletter, PodcastEpisode, EmailSignup
from .serializers import (
    NewsletterSerializer, NewsletterListSerializer,
    PodcastEpisodeSerializer, PodcastEpisodeListSerializer,
    EmailSignupSerializer, EmailSignupCreateSerializer
)


class NewsletterSerializerTest(TestCase):
    """Test cases for Newsletter serializers"""
    
    def setUp(self):
        self.newsletter = Newsletter.objects.create(
            title="Test Newsletter",
            slug="test-newsletter",
            content="This is test content",
            excerpt="Test excerpt",
            featured_image="https://example.com/image.jpg",
            published=True
        )
    
    def test_newsletter_serializer_fields(self):
        """Test NewsletterSerializer includes all required fields"""
        serializer = NewsletterSerializer(self.newsletter)
        expected_fields = {
            'id', 'title', 'slug', 'content', 'excerpt', 
            'featured_image', 'published', 'created_at', 
            'updated_at', 'published_at'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)
    
    def test_newsletter_list_serializer_fields(self):
        """Test NewsletterListSerializer includes minimal fields"""
        serializer = NewsletterListSerializer(self.newsletter)
        expected_fields = {
            'id', 'title', 'slug', 'excerpt', 
            'featured_image', 'published_at'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)
    
    def test_newsletter_serializer_data_accuracy(self):
        """Test serializer returns accurate data"""
        serializer = NewsletterSerializer(self.newsletter)
        data = serializer.data
        
        self.assertEqual(data['title'], "Test Newsletter")
        self.assertEqual(data['slug'], "test-newsletter")
        self.assertEqual(data['content'], "This is test content")
        self.assertTrue(data['published'])
    
    def test_newsletter_serializer_read_only_fields(self):
        """Test that read-only fields cannot be updated"""
        data = {
            'title': 'Updated Title',
            'id': 999,  # Should be read-only
            'created_at': '2020-01-01T00:00:00Z',  # Should be read-only
        }
        serializer = NewsletterSerializer(self.newsletter, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        updated_newsletter = serializer.save()
        self.assertEqual(updated_newsletter.title, 'Updated Title')
        self.assertNotEqual(updated_newsletter.id, 999)  # Should not change


class PodcastEpisodeSerializerTest(TestCase):
    """Test cases for PodcastEpisode serializers"""
    
    def setUp(self):
        self.episode = PodcastEpisode.objects.create(
            title="Test Episode",
            slug="test-episode",
            description="Test description",
            script="This is the episode script",
            audio_url="https://example.com/audio.mp3",
            youtube_url="https://youtube.com/watch?v=test",
            spotify_url="https://spotify.com/episode/test",
            episode_number=1,
            duration="25:30",
            published=True
        )
    
    def test_podcast_episode_serializer_fields(self):
        """Test PodcastEpisodeSerializer includes all required fields"""
        serializer = PodcastEpisodeSerializer(self.episode)
        expected_fields = {
            'id', 'title', 'slug', 'description', 'script', 
            'publish_date', 'episode_number', 'duration', 
            'audio_url', 'youtube_url', 'spotify_url',
            'cover_image', 'cover_image_url', 'published', 
            'created_at', 'updated_at'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)
    
    def test_podcast_episode_list_serializer_fields(self):
        """Test PodcastEpisodeListSerializer includes minimal fields + script_snippet"""
        serializer = PodcastEpisodeListSerializer(self.episode)
        expected_fields = {
            'id', 'title', 'slug', 'description', 'publish_date',
            'episode_number', 'duration', 'audio_url', 'youtube_url', 
            'spotify_url', 'cover_image_url', 'script_snippet'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)
    
    def test_podcast_episode_serializer_data_accuracy(self):
        """Test serializer returns accurate data"""
        serializer = PodcastEpisodeSerializer(self.episode)
        data = serializer.data
        
        self.assertEqual(data['title'], "Test Episode")
        self.assertEqual(data['slug'], "test-episode")
        self.assertEqual(data['episode_number'], 1)
        self.assertEqual(data['duration'], "25:30")
        self.assertEqual(data['audio_url'], "https://example.com/audio.mp3")
    
    def test_script_snippet_generation(self):
        """Test script_snippet method in list serializer"""
        serializer = PodcastEpisodeListSerializer(self.episode)
        data = serializer.data
        
        # Should return first 200 characters + "..."
        expected_snippet = "This is the episode script"
        self.assertEqual(data['script_snippet'], expected_snippet)
        
        # Test with long script
        self.episode.script = "A" * 250
        self.episode.save()
        
        serializer = PodcastEpisodeListSerializer(self.episode)
        data = serializer.data
        self.assertEqual(len(data['script_snippet']), 203)  # 200 + "..."
        self.assertTrue(data['script_snippet'].endswith("..."))
    
    def test_script_snippet_with_no_script(self):
        """Test script_snippet returns empty string when no script"""
        self.episode.script = ""
        self.episode.save()
        
        serializer = PodcastEpisodeListSerializer(self.episode)
        data = serializer.data
        self.assertEqual(data['script_snippet'], "")
    
    def test_cover_image_url_property(self):
        """Test cover_image_url property in serializer"""
        serializer = PodcastEpisodeSerializer(self.episode)
        data = serializer.data
        
        # Should be None when no image
        self.assertIsNone(data['cover_image_url'])


class EmailSignupSerializerTest(TestCase):
    """Test cases for EmailSignup serializers"""
    
    def setUp(self):
        self.signup = EmailSignup.objects.create(
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            source="website"
        )
    
    def test_email_signup_serializer_fields(self):
        """Test EmailSignupSerializer includes all required fields"""
        serializer = EmailSignupSerializer(self.signup)
        expected_fields = {
            'id', 'email', 'first_name', 'last_name', 
            'source', 'created_at'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)
    
    def test_email_signup_create_serializer_fields(self):
        """Test EmailSignupCreateSerializer includes only writable fields"""
        data = {
            'email': 'new@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'source': 'podcast'
        }
        serializer = EmailSignupCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        expected_fields = {'email', 'first_name', 'last_name', 'source'}
        self.assertEqual(set(serializer.validated_data.keys()), expected_fields)
    
    def test_email_signup_serializer_data_accuracy(self):
        """Test serializer returns accurate data"""
        serializer = EmailSignupSerializer(self.signup)
        data = serializer.data
        
        self.assertEqual(data['email'], "test@example.com")
        self.assertEqual(data['first_name'], "John")
        self.assertEqual(data['last_name'], "Doe")
        self.assertEqual(data['source'], "website")
    
    def test_email_uniqueness_validation(self):
        """Test email uniqueness validation in create serializer"""
        # Try to create with existing email
        data = {
            'email': 'test@example.com',  # Already exists
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
        serializer = EmailSignupCreateSerializer(data=data)
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertIn('already subscribed', str(serializer.errors['email']))
    
    def test_email_signup_creation_via_serializer(self):
        """Test creating new signup via serializer"""
        data = {
            'email': 'new@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'source': 'podcast'
        }
        serializer = EmailSignupCreateSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        signup = serializer.save()
        
        self.assertEqual(signup.email, 'new@example.com')
        self.assertEqual(signup.first_name, 'Jane')
        self.assertEqual(signup.source, 'podcast')
    
    def test_email_signup_partial_data(self):
        """Test creating signup with minimal data"""
        data = {'email': 'minimal@example.com'}
        serializer = EmailSignupCreateSerializer(data=data)
        
        self.assertTrue(serializer.is_valid())
        signup = serializer.save()
        
        self.assertEqual(signup.email, 'minimal@example.com')
        self.assertEqual(signup.first_name, '')
        self.assertEqual(signup.last_name, '')
        self.assertEqual(signup.source, 'website')  # Default value
    
    def test_invalid_email_format(self):
        """Test validation with invalid email format"""
        data = {'email': 'invalid-email'}
        serializer = EmailSignupCreateSerializer(data=data)
        
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors) 