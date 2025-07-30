#!/usr/bin/env python
"""
Comprehensive backend testing script with coverage and quality checks
"""

import os
import sys
import subprocess
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}")
    print(f"Running: {' '.join(command)}")
    
    try:
        result = subprocess.run(command, capture_output=True, text=True, cwd=backend_dir)
        
        if result.returncode == 0:
            print(f"✅ {description} - PASSED")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ {description} - FAILED")
            if result.stderr:
                print("STDERR:", result.stderr)
            if result.stdout:
                print("STDOUT:", result.stdout)
            return False
            
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False

def check_coverage_installed():
    """Check if coverage is installed"""
    try:
        import coverage
        return True
    except ImportError:
        print("⚠️ Coverage not installed. Installing...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'coverage'], cwd=backend_dir)
        return True

def main():
    """Main testing function"""
    print("🧪 Starting Backend Quality & Testing Suite")
    print("=" * 50)
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Track results
    results = []
    
    # 1. Check dependencies
    print("\n📦 Checking Dependencies")
    check_coverage_installed()
    
    # 2. Code quality checks
    print("\n🔍 Code Quality Checks")
    
    # Check for common issues
    results.append(run_command(
        [sys.executable, 'manage.py', 'check'],
        "Django System Check"
    ))
    
    # 3. Security checks
    results.append(run_command(
        [sys.executable, 'manage.py', 'check', '--deploy'],
        "Django Security Check"
    ))
    
    # 4. Run migrations check
    results.append(run_command(
        [sys.executable, 'manage.py', 'makemigrations', '--check', '--dry-run'],
        "Migration Check"
    ))
    
    # 5. Run unit tests with coverage
    print("\n🧪 Running Unit Tests with Coverage")
    
    # Clear previous coverage data
    subprocess.run(['coverage', 'erase'], cwd=backend_dir)
    
    # Run tests with coverage
    test_result = run_command(
        ['coverage', 'run', '--source=.', 'manage.py', 'test', '--settings=test_settings', '--verbosity=2'],
        "Unit Tests with Coverage"
    )
    results.append(test_result)
    
    if test_result:
        # Generate coverage report
        print("\n📊 Coverage Report")
        subprocess.run(['coverage', 'report', '--show-missing'], cwd=backend_dir)
        
        # Generate HTML coverage report
        subprocess.run(['coverage', 'html'], cwd=backend_dir)
        print("📄 HTML coverage report generated in htmlcov/")
    
    # 6. Test management commands
    print("\n⚙️ Testing Management Commands")
    
    # Test backup command
    results.append(run_command(
        [sys.executable, 'manage.py', 'backup_data', '--output-dir', '/tmp/test_backup'],
        "Backup Command Test"
    ))
    
    # Test create_admin command
    results.append(run_command(
        [sys.executable, 'manage.py', 'create_admin'],
        "Create Admin Command Test"
    ))
    
    # 7. API endpoint validation
    print("\n🌐 API Endpoint Validation")
    
    # Check models (validate was removed in newer Django)
    results.append(run_command(
        [sys.executable, 'manage.py', 'check', '--tag', 'models'],
        "Model Validation"
    ))
    
    # 8. Performance tests (basic)
    print("\n⚡ Basic Performance Tests")
    
    # Test database queries
    results.append(run_command(
        [sys.executable, 'manage.py', 'shell', '-c', 
         'from core.models import Newsletter; print(f"Newsletter count: {Newsletter.objects.count()}")'],
        "Database Query Test"
    ))
    
    # 9. Summary
    print("\n" + "=" * 50)
    print("📋 Test Results Summary")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {total - passed}")
    print(f"📊 Success Rate: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is ready for deployment.")
        return 0
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please fix issues before deployment.")
        return 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code) 