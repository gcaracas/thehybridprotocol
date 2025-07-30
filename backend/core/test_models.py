from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import date, timedelta
from .models import Newsletter, PodcastEpisode, EmailSignup


class NewsletterModelTest(TestCase):
    """Test cases for Newsletter model"""
    
    def setUp(self):
        self.newsletter = Newsletter.objects.create(
            title="Test Newsletter",
            slug="test-newsletter",
            content="This is test content",
            excerpt="Test excerpt",
            featured_image="https://example.com/image.jpg"
        )
    
    def test_newsletter_creation(self):
        """Test newsletter creation with required fields"""
        self.assertEqual(self.newsletter.title, "Test Newsletter")
        self.assertEqual(self.newsletter.slug, "test-newsletter")
        self.assertFalse(self.newsletter.published)
        self.assertIsNone(self.newsletter.published_at)
    
    def test_newsletter_str_method(self):
        """Test string representation"""
        self.assertEqual(str(self.newsletter), "Test Newsletter")
    
    def test_newsletter_auto_publish_date(self):
        """Test automatic published_at setting when published=True"""
        self.assertIsNone(self.newsletter.published_at)
        
        self.newsletter.published = True
        self.newsletter.save()
        
        self.assertIsNotNone(self.newsletter.published_at)
        self.assertTrue(self.newsletter.published)
    
    def test_newsletter_unpublish_clears_date(self):
        """Test that unpublishing clears published_at"""
        self.newsletter.published = True
        self.newsletter.save()
        self.assertIsNotNone(self.newsletter.published_at)
        
        self.newsletter.published = False
        self.newsletter.save()
        self.assertIsNone(self.newsletter.published_at)
    
    def test_newsletter_ordering(self):
        """Test newsletter ordering"""
        newsletter2 = Newsletter.objects.create(
            title="Second Newsletter",
            slug="second-newsletter",
            content="Content 2",
            excerpt="Excerpt 2",
            published=True
        )
        
        newsletters = Newsletter.objects.all()
        # Should be ordered by -published_at, -created_at
        self.assertEqual(newsletters.first(), newsletter2)
    
    def test_slug_uniqueness(self):
        """Test that slug must be unique"""
        with self.assertRaises(Exception):
            Newsletter.objects.create(
                title="Duplicate Slug",
                slug="test-newsletter",  # Same slug as setUp
                content="Content",
                excerpt="Excerpt"
            )


class PodcastEpisodeModelTest(TestCase):
    """Test cases for PodcastEpisode model"""
    
    def setUp(self):
        self.episode = PodcastEpisode.objects.create(
            title="Test Episode",
            slug="test-episode",
            description="Test description",
            script="This is the episode script",
            audio_url="https://example.com/audio.mp3",
            episode_number=1,
            duration="25:30"
        )
    
    def test_episode_creation(self):
        """Test episode creation with required fields"""
        self.assertEqual(self.episode.title, "Test Episode")
        self.assertEqual(self.episode.slug, "test-episode")
        self.assertEqual(self.episode.episode_number, 1)
        self.assertFalse(self.episode.published)
        self.assertIsNotNone(self.episode.publish_date)  # Should have default
    
    def test_episode_str_method_with_number(self):
        """Test string representation with episode number"""
        expected = "Episode 1: Test Episode"
        self.assertEqual(str(self.episode), expected)
    
    def test_episode_str_method_without_number(self):
        """Test string representation without episode number"""
        self.episode.episode_number = None
        self.episode.save()
        self.assertEqual(str(self.episode), "Test Episode")
    
    def test_cover_image_url_property_with_no_image(self):
        """Test cover_image_url property when no image"""
        self.assertIsNone(self.episode.cover_image_url)
    
    def test_episode_ordering(self):
        """Test episode ordering by publish_date"""
        future_date = date.today() + timedelta(days=1)
        episode2 = PodcastEpisode.objects.create(
            title="Future Episode",
            slug="future-episode",
            description="Future description",
            audio_url="https://example.com/audio2.mp3",
            publish_date=future_date
        )
        
        episodes = PodcastEpisode.objects.all()
        self.assertEqual(episodes.first(), episode2)  # Most recent first
    
    def test_episode_number_uniqueness(self):
        """Test that episode_number must be unique when provided"""
        with self.assertRaises(Exception):
            PodcastEpisode.objects.create(
                title="Duplicate Episode Number",
                slug="duplicate-episode",
                description="Description",
                audio_url="https://example.com/audio.mp3",
                episode_number=1  # Same as setUp
            )
    
    def test_slug_uniqueness(self):
        """Test that slug must be unique"""
        with self.assertRaises(Exception):
            PodcastEpisode.objects.create(
                title="Duplicate Slug",
                slug="test-episode",  # Same slug as setUp
                description="Description",
                audio_url="https://example.com/audio.mp3"
            )


class EmailSignupModelTest(TestCase):
    """Test cases for EmailSignup model"""
    
    def setUp(self):
        self.signup = EmailSignup.objects.create(
            email="test@example.com",
            first_name="John",
            last_name="Doe",
            source="website"
        )
    
    def test_signup_creation(self):
        """Test email signup creation"""
        self.assertEqual(self.signup.email, "test@example.com")
        self.assertEqual(self.signup.first_name, "John")
        self.assertEqual(self.signup.last_name, "Doe")
        self.assertTrue(self.signup.is_active)
        self.assertEqual(self.signup.source, "website")
    
    def test_signup_str_method_with_name(self):
        """Test string representation with name"""
        expected = "John Doe (test@example.com)"
        self.assertEqual(str(self.signup), expected)
    
    def test_signup_str_method_without_name(self):
        """Test string representation without name"""
        self.signup.first_name = ""
        self.signup.last_name = ""
        self.signup.save()
        self.assertEqual(str(self.signup), "test@example.com")
    
    def test_full_name_property(self):
        """Test full_name property"""
        self.assertEqual(self.signup.full_name, "John Doe")
        
        # Test with only first name
        self.signup.last_name = ""
        self.assertEqual(self.signup.full_name, "John")
        
        # Test with no names
        self.signup.first_name = ""
        self.assertEqual(self.signup.full_name, "")
    
    def test_email_uniqueness(self):
        """Test that email must be unique"""
        with self.assertRaises(Exception):
            EmailSignup.objects.create(
                email="test@example.com",  # Same email as setUp
                first_name="Jane",
                last_name="Smith"
            )
    
    def test_signup_ordering(self):
        """Test signup ordering by created_at"""
        signup2 = EmailSignup.objects.create(
            email="test2@example.com",
            first_name="Jane",
            last_name="Smith"
        )
        
        signups = EmailSignup.objects.all()
        self.assertEqual(signups.first(), signup2)  # Most recent first
    
    def test_default_source(self):
        """Test default source value"""
        signup = EmailSignup.objects.create(email="noSource@example.com")
        self.assertEqual(signup.source, "website") 