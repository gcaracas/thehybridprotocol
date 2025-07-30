import json
import os
from django.core.management.base import BaseCommand
from django.core import serializers
from django.db import transaction
from core.models import Newsletter, PodcastEpisode, EmailSignup

class Command(BaseCommand):
    help = 'Restore data from backup JSON files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--backup-dir',
            type=str,
            required=True,
            help='Directory containing backup files'
        )
        parser.add_argument(
            '--model',
            type=str,
            choices=['newsletters', 'podcast_episodes', 'email_signups', 'all'],
            default='all',
            help='Which model to restore (default: all)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be restored without actually doing it'
        )

    def handle(self, *args, **options):
        backup_dir = options['backup_dir']
        model_choice = options['model']
        dry_run = options['dry_run']
        
        if not os.path.exists(backup_dir):
            self.stdout.write(
                self.style.ERROR(f'❌ Backup directory does not exist: {backup_dir}')
            )
            return
        
        models_map = {
            'newsletters': Newsletter,
            'podcast_episodes': PodcastEpisode,
            'email_signups': EmailSignup
        }
        
        if model_choice == 'all':
            models_to_restore = models_map.items()
        else:
            models_to_restore = [(model_choice, models_map[model_choice])]
        
        for filename_prefix, model in models_to_restore:
            # Find the most recent backup file
            backup_files = [f for f in os.listdir(backup_dir) if f.startswith(filename_prefix)]
            if not backup_files:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ No backup files found for {filename_prefix}')
                )
                continue
            
            # Get the most recent backup
            backup_files.sort(reverse=True)
            backup_file = os.path.join(backup_dir, backup_files[0])
            
            try:
                with open(backup_file, 'r', encoding='utf-8') as f:
                    data = f.read()
                
                if dry_run:
                    # Just count what would be restored
                    objects = serializers.deserialize('json', data)
                    count = len(list(objects))
                    self.stdout.write(
                        self.style.SUCCESS(f'🔍 Would restore {count} {filename_prefix} from {backup_files[0]}')
                    )
                else:
                    # Actually restore the data
                    with transaction.atomic():
                        objects = serializers.deserialize('json', data)
                        restored_count = 0
                        
                        for obj in objects:
                            # Check if object already exists
                            if not model.objects.filter(pk=obj.object.pk).exists():
                                obj.save()
                                restored_count += 1
                            else:
                                self.stdout.write(
                                    self.style.WARNING(f'⚠️ Skipping existing {filename_prefix} ID: {obj.object.pk}')
                                )
                        
                        self.stdout.write(
                            self.style.SUCCESS(f'✅ Restored {restored_count} {filename_prefix} from {backup_files[0]}')
                        )
                        
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error restoring {filename_prefix}: {str(e)}')
                )
        
        if dry_run:
            self.stdout.write(
                self.style.SUCCESS('🔍 Dry run completed. Use without --dry-run to actually restore data.')
            ) 