#!/bin/bash

# Setup Git Hooks for The Hybrid Protocol
# This script installs pre-commit and pre-push hooks for quality assurance

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_color() {
    printf "${1}${2}${NC}\n"
}

print_color $BLUE "🔧 Setting up Git Hooks for The Hybrid Protocol..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_color $RED "❌ Error: Not in a git repository root"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook for The Hybrid Protocol
# Runs quick quality checks before allowing commit

echo "🔍 Running pre-commit quality checks..."

# Check if we're in the project root
if [[ ! -f "README.md" ]] || [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
    echo "❌ Error: Please run git commit from the project root directory"
    exit 1
fi

# Run quick linting checks
echo "📝 Checking code style..."

# Frontend linting (if package.json exists)
if [[ -f "frontend/package.json" ]]; then
    echo "  Frontend linting..."
    cd frontend
    if ! npm run lint --silent; then
        echo "❌ Frontend linting failed. Please fix linting errors before committing."
        exit 1
    fi
    echo "  Frontend TypeScript check..."
    if ! npx tsc --noEmit; then
        echo "❌ TypeScript compilation failed. Please fix type errors before committing."
        exit 1
    fi
    cd ..
    echo "✅ Frontend checks passed"
fi

# Backend basic checks
if [[ -f "backend/manage.py" ]]; then
    echo "  Backend checks..."
    cd backend
    
    # Try to find Python - check for virtual environment first, then system python
    if [[ -f "venv/bin/python" ]]; then
        PYTHON_CMD="venv/bin/python"
    elif command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        echo "❌ Python not found. Please ensure Python is installed."
        exit 1
    fi
    
    if ! $PYTHON_CMD manage.py check --quiet; then
        echo "❌ Django system check failed. Please fix errors before committing."
        exit 1
    fi
    cd ..
    echo "✅ Backend checks passed"
fi

# Check for merge conflict markers
echo "🔍 Checking for merge conflict markers..."
if grep -r "<<<<<<< HEAD\|=======" --include="*.py" --include="*.js" --include="*.tsx" --include="*.ts" . 2>/dev/null; then
    echo "❌ Merge conflict markers found. Please resolve conflicts before committing."
    exit 1
fi

# Check for TODO/FIXME in new files (optional warning)
if git diff --cached --name-only | xargs grep -l "TODO\|FIXME" 2>/dev/null; then
    echo "⚠️  Warning: Files contain TODO/FIXME comments. Consider addressing them."
fi

echo "✅ Pre-commit checks passed!"
exit 0
EOF

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Pre-push hook for The Hybrid Protocol
# Runs comprehensive tests before allowing push

echo "🚀 Running pre-push comprehensive tests..."

# Check if comprehensive test script exists
if [[ -f "test_all.sh" ]]; then
    echo "🧪 Running comprehensive test suite..."
    if ! bash test_all.sh; then
        echo ""
        echo "❌ Comprehensive tests failed!"
        echo "   Please fix all test failures before pushing."
        echo "   Run './test_all.sh' to see detailed results."
        exit 1
    fi
else
    echo "⚠️ Comprehensive test script not found. Running basic checks..."
    
    # Basic frontend tests
    if [[ -f "frontend/package.json" ]]; then
        echo "🧪 Running frontend tests..."
        cd frontend
        if command -v npm &> /dev/null; then
            if ! npm test -- --watchAll=false --passWithNoTests; then
                echo "❌ Frontend tests failed!"
                exit 1
            fi
        fi
        cd ..
    fi
    
    # Basic backend tests
    if [[ -f "backend/manage.py" ]]; then
        echo "🧪 Running backend tests..."
        cd backend
        if ! python manage.py test --verbosity=1; then
            echo "❌ Backend tests failed!"
            exit 1
        fi
        cd ..
    fi
fi

echo "✅ All pre-push checks passed! Pushing to remote..."
exit 0
EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

print_color $GREEN "✅ Git hooks installed successfully!"
echo ""
print_color $BLUE "📋 Installed hooks:"
print_color $YELLOW "   • pre-commit: Quick linting and basic checks"
print_color $YELLOW "   • pre-push: Comprehensive test suite"
echo ""
print_color $BLUE "🎯 Usage:"
print_color $NC "   • Hooks run automatically on git commit/push"
print_color $NC "   • To skip hooks temporarily: git commit --no-verify"
print_color $NC "   • To run tests manually: ./test_all.sh"
echo ""
print_color $GREEN "🛡️ Your repository is now protected by quality gates!" 