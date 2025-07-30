from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Newsletter, PodcastEpisode, EmailSignup


class NewsletterAPITest(APITestCase):
    """Test cases for Newsletter API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.published_newsletter = Newsletter.objects.create(
            title="Published Newsletter",
            slug="published-newsletter",
            content="Published content",
            excerpt="Published excerpt",
            published=True
        )
        self.unpublished_newsletter = Newsletter.objects.create(
            title="Unpublished Newsletter",
            slug="unpublished-newsletter",
            content="Unpublished content",
            excerpt="Unpublished excerpt",
            published=False
        )
    
    def test_newsletter_list_endpoint(self):
        """Test GET /api/newsletters/ returns only published newsletters"""
        url = reverse('core:newsletter_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'published-newsletter')
    
    def test_newsletter_detail_endpoint(self):
        """Test GET /api/newsletters/<slug>/ returns published newsletter"""
        url = reverse('core:newsletter_detail', kwargs={'slug': 'published-newsletter'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Published Newsletter')
        self.assertIn('content', response.data)  # Full serializer
    
    def test_newsletter_detail_unpublished_404(self):
        """Test GET unpublished newsletter returns 404"""
        url = reverse('core:newsletter_detail', kwargs={'slug': 'unpublished-newsletter'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_newsletter_detail_nonexistent_404(self):
        """Test GET nonexistent newsletter returns 404"""
        url = reverse('core:newsletter_detail', kwargs={'slug': 'nonexistent'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class PodcastEpisodeAPITest(APITestCase):
    """Test cases for Podcast Episode API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.published_episode = PodcastEpisode.objects.create(
            title="Published Episode",
            slug="published-episode",
            description="Published description",
            script="Published script content",
            audio_url="https://example.com/audio1.mp3",
            episode_number=1,
            published=True
        )
        self.unpublished_episode = PodcastEpisode.objects.create(
            title="Unpublished Episode",
            slug="unpublished-episode",
            description="Unpublished description",
            audio_url="https://example.com/audio2.mp3",
            episode_number=2,
            published=False
        )
    
    def test_podcast_episodes_list_endpoint(self):
        """Test GET /api/podcast-episodes/ returns only published episodes"""
        url = reverse('core:podcast_episodes_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'published-episode')
        
        # Should use list serializer (no script field, but script_snippet)
        self.assertNotIn('script', response.data[0])
        self.assertIn('script_snippet', response.data[0])
    
    def test_podcast_episodes_simplified_endpoint(self):
        """Test GET /api/podcast/ also works (simplified URL)"""
        url = reverse('core:podcast_list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_podcast_episode_detail_endpoint(self):
        """Test GET /api/podcast-episodes/<slug>/ returns published episode"""
        url = reverse('core:podcast_episodes_detail', kwargs={'slug': 'published-episode'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Published Episode')
        self.assertIn('script', response.data)  # Full serializer includes script
        self.assertEqual(response.data['script'], 'Published script content')
    
    def test_podcast_episode_detail_simplified_endpoint(self):
        """Test GET /api/podcast/<slug>/ also works"""
        url = reverse('core:podcast_detail', kwargs={'slug': 'published-episode'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Published Episode')
    
    def test_podcast_episode_detail_unpublished_404(self):
        """Test GET unpublished episode returns 404"""
        url = reverse('core:podcast_episodes_detail', kwargs={'slug': 'unpublished-episode'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_podcast_episode_ordering(self):
        """Test episodes are ordered by publish_date descending"""
        # Create episode with future date
        future_episode = PodcastEpisode.objects.create(
            title="Future Episode",
            slug="future-episode",
            description="Future description",
            audio_url="https://example.com/audio3.mp3",
            published=True,
            publish_date="2025-12-31"
        )
        
        url = reverse('core:podcast_episodes_list')
        response = self.client.get(url)
        
        # Future episode should be first (most recent publish_date)
        self.assertEqual(response.data[0]['slug'], 'future-episode')


class EmailSignupAPITest(APITestCase):
    """Test cases for Email Signup API endpoint"""
    
    def setUp(self):
        self.client = APIClient()
        self.valid_signup_data = {
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'source': 'website'
        }
    
    def test_email_signup_creation_success(self):
        """Test POST /api/email-signup/ creates new signup"""
        url = reverse('core:email_signup')
        response = self.client.post(url, self.valid_signup_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('Successfully subscribed', response.data['message'])
        
        # Verify signup was created
        signup = EmailSignup.objects.get(email='test@example.com')
        self.assertEqual(signup.first_name, 'John')
        self.assertEqual(signup.source, 'website')
    
    def test_email_signup_minimal_data(self):
        """Test email signup with only email"""
        data = {'email': 'minimal@example.com'}
        url = reverse('core:email_signup')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        signup = EmailSignup.objects.get(email='minimal@example.com')
        self.assertEqual(signup.first_name, '')
        self.assertEqual(signup.source, 'website')  # Default
    
    def test_email_signup_duplicate_email_error(self):
        """Test duplicate email returns error"""
        # Create first signup
        EmailSignup.objects.create(email='test@example.com')
        
        # Try to create duplicate
        url = reverse('core:email_signup')
        response = self.client.post(url, self.valid_signup_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_email_signup_invalid_email_error(self):
        """Test invalid email format returns error"""
        data = {
            'email': 'invalid-email',
            'first_name': 'John'
        }
        url = reverse('core:email_signup')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_email_signup_missing_email_error(self):
        """Test missing email returns error"""
        data = {'first_name': 'John'}
        url = reverse('core:email_signup')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


class HealthCheckAPITest(APITestCase):
    """Test cases for health check and info endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_health_check_endpoint(self):
        """Test GET /api/health/ returns healthy status"""
        url = reverse('core:health_check')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertIn('message', response.data)
    
    def test_api_info_endpoint(self):
        """Test GET /api/ returns API information"""
        url = reverse('core:api_info')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertIn('version', response.data)
        self.assertIn('endpoints', response.data)
        
        # Check that all expected endpoints are listed
        endpoints = response.data['endpoints']
        expected_endpoints = [
            'newsletters', 'newsletter_detail', 'podcast_episodes',
            'podcast_detail', 'email_signup', 'health'
        ]
        for endpoint in expected_endpoints:
            self.assertIn(endpoint, endpoints)


class APIMethodRestrictionsTest(APITestCase):
    """Test that endpoints only allow appropriate HTTP methods"""
    
    def setUp(self):
        self.client = APIClient()
        self.newsletter = Newsletter.objects.create(
            title="Test Newsletter",
            slug="test-newsletter",
            content="Content",
            excerpt="Excerpt",
            published=True
        )
    
    def test_newsletter_endpoints_read_only(self):
        """Test newsletter endpoints only allow GET"""
        list_url = reverse('core:newsletter_list')
        detail_url = reverse('core:newsletter_detail', kwargs={'slug': 'test-newsletter'})
        
        # POST should not be allowed
        response = self.client.post(list_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        # PUT should not be allowed
        response = self.client.put(detail_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        # DELETE should not be allowed
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def test_email_signup_endpoint_post_only(self):
        """Test email signup endpoint only allows POST"""
        url = reverse('core:email_signup')
        
        # GET should not be allowed
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        # PUT should not be allowed
        response = self.client.put(url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class APIContentTypeTest(APITestCase):
    """Test API content type handling"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_json_content_type_accepted(self):
        """Test API accepts JSON content type"""
        url = reverse('core:email_signup')
        data = {'email': 'test@example.com'}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_form_data_content_type_accepted(self):
        """Test API accepts form data"""
        url = reverse('core:email_signup')
        data = {'email': 'test2@example.com'}
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 