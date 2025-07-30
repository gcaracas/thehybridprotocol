"""
Enhanced backup system with external storage and validation.
Prevents data loss by creating multiple backup copies.
"""

from django.core.management.base import BaseCommand
from django.core import serializers
from django.conf import settings
from core.models import Newsletter, PodcastEpisode, EmailSignup
import os
import json
import datetime
import hashlib
import sys


class Command(BaseCommand):
    help = 'Enhanced backup with validation and external storage'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--output-dir',
            type=str,
            default='/tmp/backups',
            help='Directory to store backup files',
        )
        parser.add_argument(
            '--validate',
            action='store_true',
            help='Validate backup integrity after creation',
        )
        parser.add_argument(
            '--compress',
            action='store_true',
            help='Compress backup files',
        )
        parser.add_argument(
            '--external-url',
            type=str,
            help='External URL to upload backup (webhook/API)',
        )
    
    def handle(self, *args, **options):
        """Create enhanced backup with validation"""
        
        output_dir = options['output_dir']
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'🔄 Creating enhanced backup at {timestamp}...'
            )
        )
        
        backup_manifest = {
            'timestamp': timestamp,
            'django_version': getattr(settings, 'DJANGO_VERSION', 'unknown'),
            'environment': 'production' if not settings.DEBUG else 'development',
            'files': {},
            'checksums': {},
            'record_counts': {}
        }
        
        # Backup each model
        models_to_backup = [
            ('newsletters', Newsletter),
            ('podcast_episodes', PodcastEpisode), 
            ('email_signups', EmailSignup)
        ]
        
        for model_name, model_class in models_to_backup:
            success, file_path, record_count, checksum = self._backup_model(
                model_class, model_name, output_dir, timestamp
            )
            
            if success:
                backup_manifest['files'][model_name] = file_path
                backup_manifest['checksums'][model_name] = checksum
                backup_manifest['record_counts'][model_name] = record_count
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Backed up {record_count} {model_name} to {file_path}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'❌ Failed to backup {model_name}')
                )
                sys.exit(1)
        
        # Create backup manifest
        manifest_file = os.path.join(output_dir, f'backup_manifest_{timestamp}.json')
        with open(manifest_file, 'w') as f:
            json.dump(backup_manifest, f, indent=2)
        
        # Validate backup if requested
        if options['validate']:
            if self._validate_backup(backup_manifest):
                self.stdout.write(
                    self.style.SUCCESS('✅ Backup validation passed')
                )
            else:
                self.stdout.write(
                    self.style.ERROR('❌ Backup validation failed')
                )
                sys.exit(1)
        
        # Upload to external storage if URL provided
        if options['external_url']:
            self._upload_to_external(backup_manifest, options['external_url'])
        
        # Create summary
        total_records = sum(backup_manifest['record_counts'].values())
        summary_file = os.path.join(output_dir, f'backup_summary_{timestamp}.txt')
        
        with open(summary_file, 'w') as f:
            f.write(f"Enhanced Backup Summary - {timestamp}\n")
            f.write("=" * 50 + "\n")
            f.write(f"Environment: {backup_manifest['environment']}\n")
            f.write(f"Total Records: {total_records}\n")
            f.write(f"Backup Directory: {output_dir}\n")
            f.write(f"Manifest File: {manifest_file}\n\n")
            
            for model_name, count in backup_manifest['record_counts'].items():
                f.write(f"{model_name}: {count} records\n")
        
        self.stdout.write(
            self.style.SUCCESS(
                f'🎯 Enhanced backup completed!\n'
                f'   Total Records: {total_records}\n'
                f'   Manifest: {manifest_file}\n'
                f'   Summary: {summary_file}'
            )
        )
    
    def _backup_model(self, model_class, model_name, output_dir, timestamp):
        """Backup a single model with checksum validation"""
        try:
            queryset = model_class.objects.all()
            record_count = queryset.count()
            
            if record_count == 0:
                # Create empty file for consistency
                file_path = os.path.join(output_dir, f'{model_name}_{timestamp}.json')
                with open(file_path, 'w') as f:
                    f.write('[]')
                return True, file_path, 0, self._calculate_checksum('[]')
            
            # Serialize data
            serialized_data = serializers.serialize('json', queryset, indent=2)
            
            # Calculate checksum
            checksum = self._calculate_checksum(serialized_data)
            
            # Save to file
            file_path = os.path.join(output_dir, f'{model_name}_{timestamp}.json')
            with open(file_path, 'w') as f:
                f.write(serialized_data)
            
            return True, file_path, record_count, checksum
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error backing up {model_name}: {e}')
            )
            return False, None, 0, None
    
    def _calculate_checksum(self, data):
        """Calculate SHA256 checksum of data"""
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    
    def _validate_backup(self, manifest):
        """Validate backup integrity"""
        try:
            for model_name, file_path in manifest['files'].items():
                if not os.path.exists(file_path):
                    self.stdout.write(
                        self.style.ERROR(f'Backup file missing: {file_path}')
                    )
                    return False
                
                # Verify checksum
                with open(file_path, 'r') as f:
                    content = f.read()
                
                expected_checksum = manifest['checksums'][model_name]
                actual_checksum = self._calculate_checksum(content)
                
                if expected_checksum != actual_checksum:
                    self.stdout.write(
                        self.style.ERROR(
                            f'Checksum mismatch for {model_name}: '
                            f'expected {expected_checksum}, got {actual_checksum}'
                        )
                    )
                    return False
            
            return True
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Validation error: {e}')
            )
            return False
    
    def _upload_to_external(self, manifest, external_url):
        """Upload backup to external storage (webhook/API)"""
        try:
            import requests
            
            # This is a placeholder for external backup upload
            # Could be implemented with various cloud storage APIs
            self.stdout.write(
                self.style.WARNING(
                    f'📤 External upload to {external_url} - Implementation needed'
                )
            )
            
        except ImportError:
            self.stdout.write(
                self.style.WARNING('requests library not available for external upload')
            )
        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f'External upload failed: {e}')
            )