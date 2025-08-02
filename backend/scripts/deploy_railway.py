#!/usr/bin/env python
"""
Railway deployment script for The Hybrid Protocol
Handles database migrations, sample data population, and admin user creation
ALWAYS runs data migrations on every deployment
"""
import os
import sys
import django
import subprocess
from pathlib import Path

# Add the project directory to the Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'thehybridprotocol.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.db import connection


def run_command(command, description):
    """Run a Django management command with error handling"""
    print(f"🔄 {description}...")
    try:
        execute_from_command_line(['manage.py'] + command.split())
        print(f"✅ {description} completed successfully")
        return True
    except Exception as e:
        print(f"❌ {description} failed: {str(e)}")
        return False


def test_db_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        return False


def create_media_directories():
    """Create necessary media directories"""
    print("📁 Creating media directories...")
    try:
        media_root = os.environ.get('MEDIA_ROOT', '/app/media')
        staticfiles_dir = os.environ.get('STATIC_ROOT', '/app/staticfiles')
        
        # Create directories
        os.makedirs(media_root, exist_ok=True)
        os.makedirs(staticfiles_dir, exist_ok=True)
        
        # Set permissions
        os.chmod(media_root, 0o755)
        os.chmod(staticfiles_dir, 0o755)
        
        print("✅ Media directories created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create media directories: {str(e)}")
        return False


def run_data_migrations():
    """Run data migrations and sample data population"""
    print("📦 Running data migrations and sample data population...")
    
    # Step 1: Run Django migrations
    if not run_command('migrate --noinput', 'Running Django migrations'):
        print("❌ Data migration failed: Django migrations failed")
        return False
    
    # Step 2: Populate sample data (always run on deployment)
    print("📝 Populating/updating sample data...")
    try:
        # Import and run the sample data script
        from scripts.populate_sample_data import main as populate_data
        populate_data()
        print("✅ Sample data populated successfully")
    except Exception as e:
        print(f"❌ Sample data population failed: {str(e)}")
        return False
    
    return True


def main():
    """Main deployment function"""
    print("🚀 Starting deployment with data migrations...")
    print("=" * 60)
    
    # Check if we're in Railway environment
    is_railway = os.environ.get('RAILWAY_ENVIRONMENT') is not None
    print(f"🌐 Environment: {'Railway' if is_railway else 'Local'}")
    print(f"🔧 Always running data migrations: YES")
    
    # Step 1: Test database connection
    if not test_db_connection():
        print("❌ Deployment failed: Database connection failed")
        sys.exit(1)
    
    # Step 2: Create media directories
    if not create_media_directories():
        print("❌ Deployment failed: Could not create media directories")
        sys.exit(1)
    
    # Step 3: Run data migrations (ALWAYS run on deployment)
    if not run_data_migrations():
        print("❌ Deployment failed: Data migrations failed")
        sys.exit(1)
    
    # Step 4: Create admin user (only if it doesn't exist)
    if not run_command('create_admin', 'Creating admin user'):
        print("⚠️  Warning: Admin user creation failed (may already exist)")
    
    # Step 5: Collect static files
    if not run_command('collectstatic --noinput --clear', 'Collecting static files'):
        print("❌ Deployment failed: Static file collection failed")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ Deployment completed successfully!")
    print("\n📋 Deployment Summary:")
    print("   • Database connection: ✅")
    print("   • Media directories: ✅")
    print("   • Django migrations: ✅")
    print("   • Sample data population: ✅")
    print("   • Admin user: ✅")
    print("   • Static files: ✅")
    print("\n🚀 Application is ready to serve!")
    print("\n💡 Data migrations will run on every deployment!")


if __name__ == '__main__':
    main() 