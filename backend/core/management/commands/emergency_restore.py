"""
Emergency data recovery system.
Quick restoration from various backup sources.
"""

from django.core.management.base import BaseCommand
from django.core import serializers
from django.db import transaction
from core.models import Newsletter, PodcastEpisode, EmailSignup
import os
import json
import sys


class Command(BaseCommand):
    help = 'Emergency data recovery from backups'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--backup-dir',
            type=str,
            required=True,
            help='Directory containing backup files',
        )
        parser.add_argument(
            '--manifest',
            type=str,
            help='Backup manifest file (auto-detected if not provided)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be restored without making changes',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force restore even if data exists',
        )
        parser.add_argument(
            '--specific-model',
            type=str,
            choices=['newsletters', 'podcast_episodes', 'email_signups'],
            help='Restore only specific model',
        )
    
    def handle(self, *args, **options):
        """Execute emergency recovery"""
        
        backup_dir = options['backup_dir']
        
        if not os.path.exists(backup_dir):
            self.stdout.write(
                self.style.ERROR(f'❌ Backup directory not found: {backup_dir}')
            )
            sys.exit(1)
        
        self.stdout.write(
            self.style.WARNING(
                f'🚨 EMERGENCY RECOVERY MODE\n'
                f'   Backup Directory: {backup_dir}\n'
                f'   Dry Run: {options["dry_run"]}'
            )
        )
        
        # Find manifest file
        manifest_file = options['manifest']
        if not manifest_file:
            manifest_file = self._find_latest_manifest(backup_dir)
        
        if not manifest_file or not os.path.exists(manifest_file):
            self.stdout.write(
                self.style.WARNING(
                    '⚠️ No manifest found, attempting direct file recovery'
                )
            )
            self._recover_without_manifest(backup_dir, options)
        else:
            self._recover_with_manifest(manifest_file, options)
    
    def _find_latest_manifest(self, backup_dir):
        """Find the most recent backup manifest"""
        manifest_files = [
            f for f in os.listdir(backup_dir) 
            if f.startswith('backup_manifest_') and f.endswith('.json')
        ]
        
        if not manifest_files:
            return None
        
        # Sort by filename (timestamp) and get latest
        manifest_files.sort(reverse=True)
        return os.path.join(backup_dir, manifest_files[0])
    
    def _recover_with_manifest(self, manifest_file, options):
        """Recover using backup manifest"""
        try:
            with open(manifest_file, 'r') as f:
                manifest = json.load(f)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'📋 Found manifest: {manifest["timestamp"]}\n'
                    f'   Environment: {manifest["environment"]}\n'
                    f'   Total Records: {sum(manifest["record_counts"].values())}'
                )
            )
            
            if not options['force']:
                if not self._confirm_restore(manifest):
                    self.stdout.write(
                        self.style.WARNING('❌ Recovery cancelled by user')
                    )
                    return
            
            # Restore each model
            models_restored = 0
            total_records = 0
            
            for model_name, file_path in manifest['files'].items():
                if options['specific_model'] and model_name != options['specific_model']:
                    continue
                
                if not os.path.exists(file_path):
                    self.stdout.write(
                        self.style.ERROR(f'❌ Backup file missing: {file_path}')
                    )
                    continue
                
                records_restored = self._restore_model_from_file(
                    model_name, file_path, options['dry_run']
                )
                
                if records_restored >= 0:
                    models_restored += 1
                    total_records += records_restored
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'✅ Restored {records_restored} {model_name}'
                        )
                    )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'🎯 Recovery completed!\n'
                    f'   Models restored: {models_restored}\n'
                    f'   Total records: {total_records}'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Recovery failed: {e}')
            )
            sys.exit(1)
    
    def _recover_without_manifest(self, backup_dir, options):
        """Attempt recovery without manifest (fallback)"""
        
        # Look for backup files
        backup_files = [f for f in os.listdir(backup_dir) if f.endswith('.json')]
        
        model_mapping = {
            'newsletters': Newsletter,
            'podcast_episodes': PodcastEpisode,
            'email_signups': EmailSignup
        }
        
        for backup_file in backup_files:
            for model_name in model_mapping.keys():
                if model_name in backup_file:
                    if options['specific_model'] and model_name != options['specific_model']:
                        continue
                        
                    file_path = os.path.join(backup_dir, backup_file)
                    records_restored = self._restore_model_from_file(
                        model_name, file_path, options['dry_run']
                    )
                    
                    if records_restored >= 0:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f'✅ Restored {records_restored} {model_name} from {backup_file}'
                            )
                        )
    
    def _restore_model_from_file(self, model_name, file_path, dry_run):
        """Restore a specific model from backup file"""
        try:
            with open(file_path, 'r') as f:
                serialized_data = f.read()
            
            if not serialized_data.strip() or serialized_data.strip() == '[]':
                return 0  # Empty backup
            
            if dry_run:
                # Just count records
                data = json.loads(serialized_data)
                return len(data)
            
            # Perform actual restoration
            with transaction.atomic():
                objects = serializers.deserialize('json', serialized_data)
                restored_count = 0
                
                for obj in objects:
                    try:
                        obj.save()
                        restored_count += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.WARNING(
                                f'⚠️ Failed to restore record: {e}'
                            )
                        )
                
                return restored_count
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error restoring {model_name}: {e}')
            )
            return -1
    
    def _confirm_restore(self, manifest):
        """Ask user to confirm restoration"""
        total_records = sum(manifest['record_counts'].values())
        
        self.stdout.write(
            self.style.WARNING(
                f'\n⚠️ RESTORE CONFIRMATION REQUIRED\n'
                f'   This will restore {total_records} records\n'
                f'   Timestamp: {manifest["timestamp"]}\n'
                f'   Environment: {manifest["environment"]}\n'
            )
        )
        
        response = input('Continue with restore? [y/N]: ')
        return response.lower() in ['y', 'yes']