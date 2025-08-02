#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thehybridprotocol.settings')
django.setup()

from core.models import Newsletter

# Fix newsletter image URL
try:
    newsletter = Newsletter.objects.get(slug='newslettter-1')
    
    # Clear the malformed image URL
    newsletter.featured_image = None
    newsletter.save()
    
    print(f"Fixed newsletter image URL for: {newsletter.title}")
    print("Image URL cleared - will use fallback image")
    
except Newsletter.DoesNotExist:
    print("Newsletter not found")

print("Image URL fix completed!") 