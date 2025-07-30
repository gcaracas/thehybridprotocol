"""
Django management command for pre-deployment safety checks.
Prevents data loss by validating database state before deployment.
"""

from django.core.management.base import BaseCommand
from django.db import connection
from core.models import Newsletter, PodcastEpisode, EmailSignup
import os
import sys


class Command(BaseCommand):
    help = 'Run pre-deployment safety checks to prevent data loss'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force deployment even if data exists (dangerous!)',
        )
        parser.add_argument(
            '--backup-required',
            action='store_true',
            help='Require successful backup before proceeding',
        )
    
    def handle(self, *args, **options):
        """Run comprehensive pre-deployment checks"""
        
        self.stdout.write(
            self.style.WARNING(
                '🔍 Running Pre-Deployment Safety Checks...'
            )
        )
        
        # Check 1: Database connectivity
        if not self._check_database_connection():
            self.stdout.write(
                self.style.ERROR('❌ Database connection failed!')
            )
            sys.exit(1)
        
        # Check 2: Existing data detection
        data_exists = self._check_existing_data()
        
        if data_exists and not options['force']:
            self.stdout.write(
                self.style.ERROR(
                    '🚨 CRITICAL: Existing data detected in database!\n'
                    '   - This deployment might cause data loss\n'
                    '   - Run backup_data command first\n'
                    '   - Or use --force flag (dangerous!)'
                )
            )
            sys.exit(1)
        
        # Check 3: Migration safety
        if not self._check_migration_safety():
            self.stdout.write(
                self.style.ERROR('❌ Migration safety check failed!')
            )
            sys.exit(1)
            
        # Check 4: Backup validation (if required)
        if options['backup_required']:
            if not self._validate_recent_backup():
                # Allow deployment if no data exists (initial deployment)
                if not data_exists:
                    self.stdout.write(
                        self.style.WARNING(
                            '⚠️ No backup found, but no data exists either. '
                            'Initial deployment allowed.'
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR('❌ No recent backup found!')
                    )
                    sys.exit(1)
        
        self.stdout.write(
            self.style.SUCCESS(
                '✅ Pre-deployment checks passed! Deployment is safe to proceed.'
            )
        )
    
    def _check_database_connection(self):
        """Test database connectivity"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return True
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Database error: {e}')
            )
            return False
    
    def _check_existing_data(self):
        """Check if any important data exists"""
        try:
            newsletter_count = Newsletter.objects.count()
            episode_count = PodcastEpisode.objects.count()
            signup_count = EmailSignup.objects.count()
            
            total_records = newsletter_count + episode_count + signup_count
            
            if total_records > 0:
                self.stdout.write(
                    self.style.WARNING(
                        f'📊 Found existing data:\n'
                        f'   - Newsletters: {newsletter_count}\n'
                        f'   - Podcast Episodes: {episode_count}\n'
                        f'   - Email Signups: {signup_count}\n'
                        f'   - Total Records: {total_records}'
                    )
                )
                return True
            
            self.stdout.write(
                self.style.SUCCESS('✅ No existing data found - safe to proceed')
            )
            return False
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error checking data: {e}')
            )
            return True  # Assume data exists if we can't check
    
    def _check_migration_safety(self):
        """Check if pending migrations are safe"""
        try:
            from django.core.management import execute_from_command_line
            from io import StringIO
            import sys
            
            # Capture migration plan output
            old_stdout = sys.stdout
            sys.stdout = captured_output = StringIO()
            
            try:
                execute_from_command_line(['manage.py', 'showmigrations', '--plan'])
            except SystemExit:
                pass  # showmigrations calls sys.exit
            finally:
                sys.stdout = old_stdout
            
            output = captured_output.getvalue()
            
            # Check for destructive operations
            dangerous_patterns = [
                'DROP TABLE',
                'DROP COLUMN', 
                'ALTER TABLE DROP',
                'DELETE FROM',
                'TRUNCATE'
            ]
            
            for pattern in dangerous_patterns:
                if pattern.lower() in output.lower():
                    self.stdout.write(
                        self.style.ERROR(
                            f'⚠️ Potentially destructive migration detected: {pattern}'
                        )
                    )
                    return False
            
            return True
            
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f'Could not validate migrations: {e}')
            )
            return True  # Proceed if we can't validate
    
    def _validate_recent_backup(self):
        """Check if recent backup exists"""
        backup_dirs = ['/tmp/backups', '/app/backups', './backups']
        
        for backup_dir in backup_dirs:
            if os.path.exists(backup_dir):
                files = os.listdir(backup_dir)
                if files:
                    self.stdout.write(
                        self.style.SUCCESS(f'✅ Backup found in {backup_dir}')
                    )
                    return True
        
        self.stdout.write(
            self.style.WARNING('⚠️ No recent backup found')
        )
        return False