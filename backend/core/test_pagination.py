from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from core.models import Newsletter, PodcastEpisode
from core.serializers import NewsletterListSerializer, PodcastEpisodeListSerializer
import json


class PaginationTestCase(TestCase):
    """Test pagination functionality for newsletters and podcasts"""
    
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        
        # Create test newsletters
        self.newsletters = []
        for i in range(13):
            newsletter = Newsletter.objects.create(
                title=f"Newsletter {i+1}",
                slug=f"newsletter-{i+1}",
                excerpt=f"Excerpt for newsletter {i+1}",
                content=f"Content for newsletter {i+1}",
                published=True,
                published_at=timezone.now(),
                available_in_english=True,
                available_in_spanish=False
            )
            self.newsletters.append(newsletter)
        
        # Create test podcasts
        self.podcasts = []
        for i in range(13):
            podcast = PodcastEpisode.objects.create(
                title=f"Podcast {i+1}",
                slug=f"podcast-{i+1}",
                description=f"Description for podcast {i+1}",
                publish_date=timezone.now().date(),
                episode_number=i+1,
                duration="00:30:00",
                published=True,
                available_in_english=True,
                available_in_spanish=False
            )
            self.podcasts.append(podcast)
    
    def test_newsletter_pagination_scenarios(self):
        """Test newsletter pagination with different numbers of items"""
        
        # Test with 1 newsletter
        Newsletter.objects.exclude(id=self.newsletters[0].id).delete()
        response = self.client.get('/api/newsletters/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Test with 6 newsletters
        for i in range(1, 6):
            Newsletter.objects.create(
                title=f"Newsletter {i+1}",
                slug=f"newsletter-{i+1}",
                excerpt=f"Excerpt for newsletter {i+1}",
                content=f"Content for newsletter {i+1}",
                published=True,
                published_at=timezone.now(),
                available_in_english=True,
                available_in_spanish=False
            )
        
        response = self.client.get('/api/newsletters/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 6)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Test with 7 newsletters (should have 2 pages)
        Newsletter.objects.create(
            title="Newsletter 7",
            slug="newsletter-7",
            excerpt="Excerpt for newsletter 7",
            content="Content for newsletter 7",
            published=True,
            published_at=timezone.now(),
            available_in_english=True,
            available_in_spanish=False
        )
        
        # Page 1
        response = self.client.get('/api/newsletters/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 7)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/newsletters/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 7)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Test with 12 newsletters (should have 2 pages)
        for i in range(8, 13):
            Newsletter.objects.create(
                title=f"Newsletter {i}",
                slug=f"newsletter-{i}",
                excerpt=f"Excerpt for newsletter {i}",
                content=f"Content for newsletter {i}",
                published=True,
                published_at=timezone.now(),
                available_in_english=True,
                available_in_spanish=False
            )
        
        # Page 1
        response = self.client.get('/api/newsletters/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 12)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/newsletters/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 12)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Test with 13 newsletters (should have 3 pages)
        Newsletter.objects.create(
            title="Newsletter 13",
            slug="newsletter-13",
            excerpt="Excerpt for newsletter 13",
            content="Content for newsletter 13",
            published=True,
            published_at=timezone.now(),
            available_in_english=True,
            available_in_spanish=False
        )
        
        # Page 1
        response = self.client.get('/api/newsletters/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/newsletters/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Page 3
        response = self.client.get('/api/newsletters/?page=3&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
    
    def test_podcast_pagination_scenarios(self):
        """Test podcast pagination with different numbers of items"""
        
        # Test with 1 podcast
        PodcastEpisode.objects.exclude(id=self.podcasts[0].id).delete()
        response = self.client.get('/api/podcast-episodes/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 1)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Test with 6 podcasts
        for i in range(1, 6):
            PodcastEpisode.objects.create(
                title=f"Podcast {i+1}",
                slug=f"podcast-{i+1}",
                description=f"Description for podcast {i+1}",
                publish_date=timezone.now().date(),
                episode_number=i+1,
                duration="00:30:00",
                published=True,
                available_in_english=True,
                available_in_spanish=False
            )
        
        response = self.client.get('/api/podcast-episodes/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 6)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Test with 7 podcasts (should have 2 pages)
        PodcastEpisode.objects.create(
            title="Podcast 7",
            slug="podcast-7",
            description="Description for podcast 7",
            publish_date=timezone.now().date(),
            episode_number=7,
            duration="00:30:00",
            published=True,
            available_in_english=True,
            available_in_spanish=False
        )
        
        # Page 1
        response = self.client.get('/api/podcast-episodes/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 7)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/podcast-episodes/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 7)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Test with 12 podcasts (should have 2 pages)
        for i in range(8, 13):
            PodcastEpisode.objects.create(
                title=f"Podcast {i}",
                slug=f"podcast-{i}",
                description=f"Description for podcast {i}",
                publish_date=timezone.now().date(),
                episode_number=i,
                duration="00:30:00",
                published=True,
                available_in_english=True,
                available_in_spanish=False
            )
        
        # Page 1
        response = self.client.get('/api/podcast-episodes/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 12)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/podcast-episodes/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 12)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Test with 13 podcasts (should have 3 pages)
        PodcastEpisode.objects.create(
            title="Podcast 13",
            slug="podcast-13",
            description="Description for podcast 13",
            publish_date=timezone.now().date(),
            episode_number=13,
            duration="00:30:00",
            published=True,
            available_in_english=True,
            available_in_spanish=False
        )
        
        # Page 1
        response = self.client.get('/api/podcast-episodes/?page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNone(data['previous'])
        
        # Page 2
        response = self.client.get('/api/podcast-episodes/?page=2&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 6)
        self.assertIsNotNone(data['next'])
        self.assertIsNotNone(data['previous'])
        
        # Page 3
        response = self.client.get('/api/podcast-episodes/?page=3&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 13)
        self.assertEqual(len(data['results']), 1)
        self.assertIsNone(data['next'])
        self.assertIsNotNone(data['previous'])
    
    def test_pagination_edge_cases(self):
        """Test pagination edge cases"""
        
        # Ensure we have exactly 1 newsletter for testing
        Newsletter.objects.exclude(id=self.newsletters[0].id).delete()
        
        # Test invalid page number
        response = self.client.get('/api/newsletters/?page=0&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['results']), 1)  # Should return all available items
        
        # Test invalid page size
        response = self.client.get('/api/newsletters/?page=1&page_size=0')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['results']), 1)  # Should return all available items
        
        # Test very large page number
        response = self.client.get('/api/newsletters/?page=999&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['results']), 0)  # Should return empty results
        
        # Test negative page number
        response = self.client.get('/api/newsletters/?page=-1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['results']), 1)  # Should return all available items
    
    def test_pagination_with_filters(self):
        """Test pagination works correctly with language filters"""
        
        # Create newsletters with different languages
        Newsletter.objects.all().delete()
        for i in range(7):
            Newsletter.objects.create(
                title=f"Newsletter {i+1}",
                slug=f"newsletter-{i+1}",
                excerpt=f"Excerpt for newsletter {i+1}",
                content=f"Content for newsletter {i+1}",
                published=True,
                published_at=timezone.now(),
                available_in_english=(i % 2 == 0),  # Even numbers are English
                available_in_spanish=(i % 2 == 1)   # Odd numbers are Spanish
            )
        
        # Test English filter with pagination
        response = self.client.get('/api/newsletters/?language=english&page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 4)  # 4 English newsletters
        self.assertEqual(len(data['results']), 4)
        
        # Test Spanish filter with pagination
        response = self.client.get('/api/newsletters/?language=spanish&page=1&page_size=6')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 3)  # 3 Spanish newsletters
        self.assertEqual(len(data['results']), 3) 