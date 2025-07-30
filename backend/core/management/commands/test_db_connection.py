"""
Test database connection for debugging Railway PostgreSQL issues.
"""

from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings
import os
import sys


class Command(BaseCommand):
    help = 'Test database connection and display debug info'
    
    def handle(self, *args, **options):
        """Test database connection"""
        
        self.stdout.write(
            self.style.WARNING('🔍 Testing Database Connection...')
        )
        
        # Print environment info
        self.stdout.write(f"DEBUG mode: {settings.DEBUG}")
        self.stdout.write(f"DATABASE_URL env var: {os.getenv('DATABASE_URL', 'NOT SET')}")
        
        # Print database config
        db_config = settings.DATABASES['default']
        self.stdout.write(f"Database ENGINE: {db_config.get('ENGINE', 'NOT SET')}")
        self.stdout.write(f"Database NAME: {db_config.get('NAME', 'NOT SET')}")
        self.stdout.write(f"Database HOST: {db_config.get('HOST', 'NOT SET')}")
        self.stdout.write(f"Database PORT: {db_config.get('PORT', 'NOT SET')}")
        self.stdout.write(f"Database USER: {db_config.get('USER', 'NOT SET')}")
        
        # Test connection
        try:
            self.stdout.write('🔗 Attempting database connection...')
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()[0]
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Database connection successful!')
                )
                self.stdout.write(f'📊 PostgreSQL version: {version}')
                
                # Test table query
                cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
                table_count = cursor.fetchone()[0]
                self.stdout.write(f'📋 Tables in database: {table_count}')
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Database connection failed: {e}')
            )
            self.stdout.write(f'Error type: {type(e).__name__}')
            
            # Additional debugging
            import socket
            try:
                host = db_config.get('HOST', 'localhost')
                port = int(db_config.get('PORT', 5432))
                self.stdout.write(f'🔍 Testing raw socket connection to {host}:{port}...')
                
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                result = sock.connect_ex((host, port))
                sock.close()
                
                if result == 0:
                    self.stdout.write('✅ Socket connection successful - PostgreSQL is reachable')
                else:
                    self.stdout.write(f'❌ Socket connection failed - code {result}')
                    
            except Exception as socket_error:
                self.stdout.write(f'❌ Socket test failed: {socket_error}')
            
            sys.exit(1)