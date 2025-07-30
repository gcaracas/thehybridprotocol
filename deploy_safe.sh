#!/bin/bash

# =================================================================
# THE HYBRID PROTOCOL - SAFE DEPLOYMENT SCRIPT
# =================================================================
# Prevents data loss during deployments with comprehensive checks
# =================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}🔍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}"
    echo "================================================================="
    echo "🛡️ THE HYBRID PROTOCOL - SAFE DEPLOYMENT"
    echo "================================================================="
    echo -e "${NC}"
}

# Check if we're in the right directory
check_environment() {
    if [ ! -f "backend/manage.py" ]; then
        print_error "Must be run from project root directory"
        exit 1
    fi
    
    if [ ! -d "backend/venv" ]; then
        print_error "Virtual environment not found at backend/venv"
        exit 1
    fi
}

# Pre-deployment backup
create_backup() {
    print_status "Creating comprehensive backup..."
    
    cd backend
    source venv/bin/activate
    
    # Create backup directory with timestamp
    BACKUP_DIR="/tmp/safe_deployment_backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Run enhanced backup
    python manage.py enhanced_backup --output-dir "$BACKUP_DIR" --validate
    
    if [ $? -eq 0 ]; then
        print_success "Backup created at $BACKUP_DIR"
        echo "$BACKUP_DIR" > /tmp/latest_backup_dir
    else
        print_error "Backup failed - aborting deployment"
        exit 1
    fi
    
    cd ..
}

# Pre-deployment safety checks
run_safety_checks() {
    print_status "Running pre-deployment safety checks..."
    
    cd backend
    source venv/bin/activate
    
    # Run pre-deployment checks
    python manage.py pre_deploy_check --backup-required
    
    if [ $? -eq 0 ]; then
        print_success "Safety checks passed"
    else
        print_error "Safety checks failed - aborting deployment"
        exit 1
    fi
    
    cd ..
}

# Test local changes
test_local() {
    print_status "Testing local changes..."
    
    # Run comprehensive test suite
    if [ -f "test_all.sh" ]; then
        ./test_all.sh
        if [ $? -eq 0 ]; then
            print_success "All local tests passed"
        else
            print_error "Local tests failed - fix before deploying"
            exit 1
        fi
    else
        print_warning "test_all.sh not found - skipping comprehensive tests"
    fi
}

# Commit changes
commit_changes() {
    print_status "Preparing commit..."
    
    # Check for uncommitted changes
    if git diff --quiet && git diff --staged --quiet; then
        print_warning "No changes to commit"
        return
    fi
    
    # Show what will be committed
    echo -e "${YELLOW}Changes to be committed:${NC}"
    git status --short
    
    # Ask for commit message if not provided
    if [ -z "$COMMIT_MESSAGE" ]; then
        echo -n "Enter commit message: "
        read COMMIT_MESSAGE
    fi
    
    if [ -z "$COMMIT_MESSAGE" ]; then
        print_error "Commit message required"
        exit 1
    fi
    
    # Add and commit
    git add .
    git commit -m "$COMMIT_MESSAGE"
    
    print_success "Changes committed"
}

# Deploy to production
deploy_production() {
    print_status "Deploying to production..."
    
    # Push to git
    git push origin main
    
    if [ $? -eq 0 ]; then
        print_success "Deployment initiated"
        print_status "Monitoring deployment..."
        
        # Wait and verify deployment
        sleep 30
        
        # Test production API
        if curl -f -s "https://impartial-delight-production.up.railway.app/api/health/" > /dev/null; then
            print_success "Production deployment verified"
        else
            print_warning "Production health check failed - manual verification needed"
        fi
    else
        print_error "Git push failed"
        exit 1
    fi
}

# Emergency rollback
emergency_rollback() {
    print_error "EMERGENCY ROLLBACK INITIATED"
    
    if [ -f "/tmp/latest_backup_dir" ]; then
        BACKUP_DIR=$(cat /tmp/latest_backup_dir)
        
        print_status "Restoring from backup: $BACKUP_DIR"
        
        cd backend
        source venv/bin/activate
        
        # This would require production database access
        # For now, provide manual instructions
        echo -e "${YELLOW}"
        echo "MANUAL RECOVERY INSTRUCTIONS:"
        echo "1. Access Railway production database"
        echo "2. Run: python manage.py emergency_restore --backup-dir $BACKUP_DIR"
        echo "3. Verify data restoration"
        echo -e "${NC}"
        
        cd ..
    else
        print_error "No backup directory found for rollback"
    fi
}

# Usage information
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --message MESSAGE    Commit message"
    echo "  --skip-tests        Skip local testing"
    echo "  --backup-only       Only create backup"
    echo "  --rollback          Emergency rollback"
    echo "  --help              Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 --message 'Fix image loading issue'"
    echo "  $0 --backup-only"
    echo "  $0 --rollback"
}

# Main execution
main() {
    print_header
    
    # Parse arguments
    SKIP_TESTS=false
    BACKUP_ONLY=false
    ROLLBACK=false
    COMMIT_MESSAGE=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --message)
                COMMIT_MESSAGE="$2"
                shift 2
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --backup-only)
                BACKUP_ONLY=true
                shift
                ;;
            --rollback)
                ROLLBACK=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Handle emergency rollback
    if [ "$ROLLBACK" = true ]; then
        emergency_rollback
        exit 0
    fi
    
    # Check environment
    check_environment
    
    # Create backup
    create_backup
    
    # If backup-only mode, exit here
    if [ "$BACKUP_ONLY" = true ]; then
        print_success "Backup completed successfully"
        exit 0
    fi
    
    # Run safety checks
    run_safety_checks
    
    # Test local changes (unless skipped)
    if [ "$SKIP_TESTS" = false ]; then
        test_local
    fi
    
    # Commit changes
    commit_changes
    
    # Deploy to production
    deploy_production
    
    print_success "🚀 Safe deployment completed successfully!"
    
    # Cleanup
    print_status "Cleaning up..."
    # Keep backup directory for safety
    
    echo -e "${GREEN}"
    echo "================================================================="
    echo "✅ DEPLOYMENT COMPLETE"
    echo "================================================================="
    echo "🔗 Production: https://impartial-delight-production.up.railway.app"
    echo "📊 Backup: $(cat /tmp/latest_backup_dir 2>/dev/null || echo 'Not available')"
    echo "================================================================="
    echo -e "${NC}"
}

# Execute main function with all arguments
main "$@"