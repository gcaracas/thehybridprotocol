import os
import tempfile
import json
from io import StringIO
from django.test import TestCase
from django.core.management import call_command
from django.contrib.auth.models import User
from .models import Newsletter, PodcastEpisode, EmailSignup


class CreateAdminCommandTest(TestCase):
    """Test cases for create_admin management command"""
    
    def test_create_admin_command_creates_user(self):
        """Test that create_admin command creates a superuser"""
        # Ensure no users exist
        self.assertEqual(User.objects.count(), 0)
        
        # Set environment variables
        os.environ['DJANGO_SUPERUSER_USERNAME'] = 'testadmin'
        os.environ['DJANGO_SUPERUSER_EMAIL'] = 'test@admin.com'
        os.environ['DJANGO_SUPERUSER_PASSWORD'] = 'testpass123'
        
        # Capture output
        out = StringIO()
        
        # Run command
        call_command('create_admin', stdout=out)
        
        # Check user was created
        self.assertEqual(User.objects.count(), 1)
        user = User.objects.first()
        self.assertEqual(user.username, 'testadmin')
        self.assertEqual(user.email, 'test@admin.com')
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)
        
        # Check output message
        output = out.getvalue()
        self.assertIn('✅ Superuser', output)
        self.assertIn('testadmin', output)
        self.assertIn('created', output)
        
        # Clean up environment variables
        del os.environ['DJANGO_SUPERUSER_USERNAME']
        del os.environ['DJANGO_SUPERUSER_EMAIL']
        del os.environ['DJANGO_SUPERUSER_PASSWORD']
    
    def test_create_admin_command_uses_defaults(self):
        """Test that create_admin command uses default values"""
        out = StringIO()
        call_command('create_admin', stdout=out)
        
        user = User.objects.first()
        self.assertEqual(user.username, 'admin')
        self.assertEqual(user.email, 'admin@example.com')
    
    def test_create_admin_command_skips_existing_user(self):
        """Test that create_admin command skips if user already exists"""
        # Create existing user
        User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
        
        out = StringIO()
        call_command('create_admin', stdout=out)
        
        # Should still only have one user
        self.assertEqual(User.objects.count(), 1)
        
        # Check warning message
        output = out.getvalue()
        self.assertIn('⚠️ Superuser', output)
        self.assertIn('already exists', output)


class BackupDataCommandTest(TestCase):
    """Test cases for backup_data management command"""
    
    def setUp(self):
        # Create test data
        self.newsletter = Newsletter.objects.create(
            title="Test Newsletter",
            slug="test-newsletter",
            content="Test content",
            excerpt="Test excerpt"
        )
        self.episode = PodcastEpisode.objects.create(
            title="Test Episode",
            slug="test-episode",
            description="Test description",
            audio_url="https://example.com/audio.mp3"
        )
        self.signup = EmailSignup.objects.create(
            email="test@example.com",
            first_name="John",
            last_name="Doe"
        )
    
    def test_backup_data_command_creates_backups(self):
        """Test that backup_data command creates backup files"""
        with tempfile.TemporaryDirectory() as temp_dir:
            out = StringIO()
            call_command('backup_data', '--output-dir', temp_dir, stdout=out)
            
            # Check that backup files were created
            files = os.listdir(temp_dir)
            
            # Should have 4 files: 3 model backups + 1 summary
            self.assertEqual(len(files), 4)
            
            # Check specific backup files exist
            backup_files = [f for f in files if f.endswith('.json')]
            self.assertEqual(len(backup_files), 3)
            
            # Check file names contain expected patterns
            file_patterns = ['newsletters_', 'podcast_episodes_', 'email_signups_']
            for pattern in file_patterns:
                self.assertTrue(any(pattern in f for f in backup_files))
            
            # Check summary file exists
            summary_files = [f for f in files if f.startswith('backup_summary_')]
            self.assertEqual(len(summary_files), 1)
            
            # Check output messages
            output = out.getvalue()
            self.assertIn('✅ Backed up 1 newsletters', output)
            self.assertIn('✅ Backed up 1 podcast_episodes', output)
            self.assertIn('✅ Backed up 1 email_signups', output)
            self.assertIn('🎯 Backup completed', output)
    
    def test_backup_data_command_json_content(self):
        """Test that backup files contain valid JSON with correct data"""
        with tempfile.TemporaryDirectory() as temp_dir:
            call_command('backup_data', '--output-dir', temp_dir, stdout=StringIO())
            
            # Find and read newsletter backup file
            files = os.listdir(temp_dir)
            newsletter_file = next(f for f in files if f.startswith('newsletters_'))
            
            with open(os.path.join(temp_dir, newsletter_file), 'r') as f:
                data = json.load(f)
            
            # Should be a list with one newsletter
            self.assertEqual(len(data), 1)
            
            # Check the newsletter data
            newsletter_data = data[0]
            self.assertEqual(newsletter_data['model'], 'core.newsletter')
            fields = newsletter_data['fields']
            self.assertEqual(fields['title'], 'Test Newsletter')
            self.assertEqual(fields['slug'], 'test-newsletter')
    
    def test_backup_data_command_default_directory(self):
        """Test that backup_data command creates default directory"""
        # Clean up any existing backups directory
        if os.path.exists('backups'):
            import shutil
            shutil.rmtree('backups')
        
        try:
            call_command('backup_data', stdout=StringIO())
            
            # Check that backups directory was created
            self.assertTrue(os.path.exists('backups'))
            
            # Check that files were created
            files = os.listdir('backups')
            self.assertGreater(len(files), 0)
            
        finally:
            # Clean up
            if os.path.exists('backups'):
                import shutil
                shutil.rmtree('backups')


class RestoreDataCommandTest(TestCase):
    """Test cases for restore_data management command"""
    
    def setUp(self):
        # Create test data and backup
        self.newsletter = Newsletter.objects.create(
            title="Original Newsletter",
            slug="original-newsletter",
            content="Original content",
            excerpt="Original excerpt"
        )
        
        # Create a temporary backup directory with test data
        self.temp_dir = tempfile.mkdtemp()
        
        # Create backup file manually
        backup_data = [
            {
                "model": "core.newsletter",
                "pk": 999,  # Different PK to test restoration
                "fields": {
                    "title": "Restored Newsletter",
                    "slug": "restored-newsletter",
                    "content": "Restored content",
                    "excerpt": "Restored excerpt",
                    "featured_image": "",
                    "published": False,
                    "created_at": "2024-01-01T00:00:00.000Z",
                    "updated_at": "2024-01-01T00:00:00.000Z",
                    "published_at": None
                }
            }
        ]
        
        backup_file = os.path.join(self.temp_dir, 'newsletters_20240101_000000.json')
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f)
    
    def tearDown(self):
        # Clean up temporary directory
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def test_restore_data_command_dry_run(self):
        """Test restore_data command with dry run"""
        out = StringIO()
        call_command(
            'restore_data',
            '--backup-dir', self.temp_dir,
            '--dry-run',
            stdout=out
        )
        
        # Should not have created new newsletter
        self.assertEqual(Newsletter.objects.count(), 1)
        self.assertEqual(Newsletter.objects.first().title, "Original Newsletter")
        
        # Check output
        output = out.getvalue()
        self.assertIn('🔍 Would restore 1 newsletters', output)
        self.assertIn('Dry run completed', output)
    
    def test_restore_data_command_actual_restore(self):
        """Test restore_data command actually restores data"""
        out = StringIO()
        call_command(
            'restore_data',
            '--backup-dir', self.temp_dir,
            '--model', 'newsletters',
            stdout=out
        )
        
        # Should now have two newsletters
        self.assertEqual(Newsletter.objects.count(), 2)
        
        # Check that restored newsletter exists
        restored = Newsletter.objects.get(slug='restored-newsletter')
        self.assertEqual(restored.title, 'Restored Newsletter')
        self.assertEqual(restored.pk, 999)
        
        # Check output
        output = out.getvalue()
        self.assertIn('✅ Restored 1 newsletters', output)
    
    def test_restore_data_command_skip_existing(self):
        """Test restore_data command skips existing records"""
        # Modify backup to have same PK as existing newsletter
        backup_data = [
            {
                "model": "core.newsletter",
                "pk": self.newsletter.pk,  # Same PK as existing
                "fields": {
                    "title": "Should Not Restore",
                    "slug": "should-not-restore",
                    "content": "Should not restore",
                    "excerpt": "Should not restore",
                    "featured_image": "",
                    "published": False,
                    "created_at": "2024-01-01T00:00:00.000Z",
                    "updated_at": "2024-01-01T00:00:00.000Z",
                    "published_at": None
                }
            }
        ]
        
        backup_file = os.path.join(self.temp_dir, 'newsletters_20240102_000000.json')
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f)
        
        out = StringIO()
        call_command(
            'restore_data',
            '--backup-dir', self.temp_dir,
            '--model', 'newsletters',
            stdout=out
        )
        
        # Should still have only one newsletter with original title
        self.assertEqual(Newsletter.objects.count(), 1)
        self.assertEqual(Newsletter.objects.first().title, "Original Newsletter")
        
        # Check output mentions skipping
        output = out.getvalue()
        self.assertIn('⚠️ Skipping existing newsletters', output)
    
    def test_restore_data_command_invalid_directory(self):
        """Test restore_data command with invalid directory"""
        out = StringIO()
        call_command(
            'restore_data',
            '--backup-dir', '/nonexistent/directory',
            stdout=out
        )
        
        output = out.getvalue()
        self.assertIn('❌ Backup directory does not exist', output) 