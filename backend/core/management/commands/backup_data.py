import json
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.core import serializers
from core.models import Newsletter, PodcastEpisode, EmailSignup

class Command(BaseCommand):
    help = 'Backup all core app data to JSON files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output-dir',
            type=str,
            default='backups',
            help='Directory to save backup files (default: backups)'
        )

    def handle(self, *args, **options):
        output_dir = options['output_dir']
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Create backup directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Backup each model
        models_to_backup = [
            (Newsletter, 'newsletters'),
            (PodcastEpisode, 'podcast_episodes'),
            (EmailSignup, 'email_signups')
        ]
        
        for model, filename in models_to_backup:
            try:
                # Get all objects
                objects = model.objects.all()
                
                # Serialize to JSON
                data = serializers.serialize('json', objects, indent=2)
                
                # Save to file
                backup_file = os.path.join(output_dir, f'{filename}_{timestamp}.json')
                with open(backup_file, 'w', encoding='utf-8') as f:
                    f.write(data)
                
                count = objects.count()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Backed up {count} {filename} to {backup_file}')
                )
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error backing up {filename}: {str(e)}')
                )
        
        # Create a summary file
        summary_file = os.path.join(output_dir, f'backup_summary_{timestamp}.txt')
        with open(summary_file, 'w') as f:
            f.write(f'Backup created: {datetime.now()}\n')
            f.write(f'Newsletter count: {Newsletter.objects.count()}\n')
            f.write(f'Podcast episodes count: {PodcastEpisode.objects.count()}\n')
            f.write(f'Email signups count: {EmailSignup.objects.count()}\n')
        
        self.stdout.write(
            self.style.SUCCESS(f'🎯 Backup completed! Summary: {summary_file}')
        ) 