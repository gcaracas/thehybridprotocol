#!/usr/bin/env python
"""
Script to populate the database with sample localized content
"""
import os
import sys
import django
from datetime import datetime

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thehybridprotocol.settings')
django.setup()

from core.models import LocalizedElement, Category, Tag, Archive, TextWidget


def create_localized_elements():
    """Create sample localized elements"""
    elements_data = [
        # Categories
        {'english': 'Branding', 'spanish': 'Marca'},
        {'english': 'Design', 'spanish': 'Diseño'},
        {'english': 'Development', 'spanish': 'Desarrollo'},
        {'english': 'Photography', 'spanish': 'Fotografía'},
        {'english': 'Other', 'spanish': 'Otro'},
        
        # Tags
        {'english': 'Design', 'spanish': 'Diseño'},
        {'english': 'Portfolio', 'spanish': 'Portafolio'},
        {'english': 'Digital', 'spanish': 'Digital'},
        {'english': 'Branding', 'spanish': 'Marca'},
        {'english': 'Theme', 'spanish': 'Tema'},
        {'english': 'Clean', 'spanish': 'Limpio'},
        {'english': 'UI & UX', 'spanish': 'UI y UX'},
        {'english': 'Love', 'spanish': 'Amor'},
        
        # Widget content
        {'english': 'Text Widget', 'spanish': 'Widget de Texto'},
        {'english': 'Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 'spanish': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'},
    ]
    
    created_elements = []
    for data in elements_data:
        element, created = LocalizedElement.objects.get_or_create(
            english=data['english'],
            defaults={'spanish': data['spanish']}
        )
        created_elements.append(element)
        if created:
            print(f"✅ Created localized element: {element.english}")
        else:
            print(f"ℹ️  Element already exists: {element.english}")
    
    return created_elements


def create_categories(elements):
    """Create sample categories"""
    category_data = [
        {'name': 'Branding', 'count': 7},
        {'name': 'Design', 'count': 15},
        {'name': 'Development', 'count': 3},
        {'name': 'Photography', 'count': 5},
        {'name': 'Other', 'count': 1},
    ]
    
    for data in category_data:
        name_element = next((e for e in elements if e.english == data['name']), None)
        if name_element:
            category, created = Category.objects.get_or_create(
                name=name_element,
                defaults={
                    'slug': data['name'].lower(),
                    'count': data['count'],
                    'is_active': True
                }
            )
            if created:
                print(f"✅ Created category: {category.name.english}")
            else:
                print(f"ℹ️  Category already exists: {category.name.english}")


def create_tags(elements):
    """Create sample tags"""
    tag_data = [
        'Design', 'Portfolio', 'Digital', 'Branding', 'Theme', 'Clean', 'UI & UX', 'Love'
    ]
    
    for tag_name in tag_data:
        name_element = next((e for e in elements if e.english == tag_name), None)
        if name_element:
            tag, created = Tag.objects.get_or_create(
                name=name_element,
                defaults={
                    'slug': tag_name.lower().replace(' & ', '-').replace(' ', '-'),
                    'is_active': True
                }
            )
            if created:
                print(f"✅ Created tag: {tag.name.english}")
            else:
                print(f"ℹ️  Tag already exists: {tag.name.english}")


def create_archives():
    """Create sample archive entries"""
    archive_data = [
        {'month': 2, 'year': 2021, 'count': 5},
        {'month': 1, 'year': 2021, 'count': 8},
        {'month': 12, 'year': 2020, 'count': 3},
    ]
    
    for data in archive_data:
        archive, created = Archive.objects.get_or_create(
            month=data['month'],
            year=data['year'],
            defaults={
                'count': data['count'],
                'is_active': True
            }
        )
        if created:
            print(f"✅ Created archive: {archive}")
        else:
            print(f"ℹ️  Archive already exists: {archive}")


def create_text_widgets(elements):
    """Create sample text widgets"""
    widget_title = next((e for e in elements if e.english == 'Text Widget'), None)
    widget_content = next((e for e in elements if 'Consectetur adipiscing elit' in e.english), None)
    
    if widget_title and widget_content:
        widget, created = TextWidget.objects.get_or_create(
            title=widget_title,
            defaults={
                'content': widget_content,
                'order': 1,
                'is_active': True
            }
        )
        if created:
            print(f"✅ Created text widget: {widget.title.english}")
        else:
            print(f"ℹ️  Text widget already exists: {widget.title.english}")


def main():
    """Main function to populate sample data"""
    print("🚀 Starting sample data population...")
    print("=" * 50)
    
    # Create localized elements
    print("\n📝 Creating localized elements...")
    elements = create_localized_elements()
    
    # Create categories
    print("\n📂 Creating categories...")
    create_categories(elements)
    
    # Create tags
    print("\n🏷️  Creating tags...")
    create_tags(elements)
    
    # Create archives
    print("\n📅 Creating archives...")
    create_archives()
    
    # Create text widgets
    print("\n📄 Creating text widgets...")
    create_text_widgets(elements)
    
    print("\n" + "=" * 50)
    print("✅ Sample data population completed!")
    print("\n📋 Summary:")
    print(f"   • Localized Elements: {LocalizedElement.objects.count()}")
    print(f"   • Categories: {Category.objects.count()}")
    print(f"   • Tags: {Tag.objects.count()}")
    print(f"   • Archives: {Archive.objects.count()}")
    print(f"   • Text Widgets: {TextWidget.objects.count()}")


if __name__ == '__main__':
    main() 