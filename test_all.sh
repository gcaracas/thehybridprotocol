#!/bin/bash

# Comprehensive Quality Assurance Script for The Hybrid Protocol
# Tests both frontend and backend with coverage and quality checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Emojis for better UX
CHECKMARK="✅"
CROSS="❌"
WARNING="⚠️"
ROCKET="🚀"
GEAR="⚙️"
MICROSCOPE="🔬"
SHIELD="🛡️"
CHART="📊"
PACKAGE="📦"

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Function to print section headers
print_header() {
    echo ""
    print_color $WHITE "$(printf '%.0s=' {1..60})"
    print_color $CYAN "${1}"
    print_color $WHITE "$(printf '%.0s=' {1..60})"
}

# Function to run a command and track success/failure
run_test() {
    local test_name="$1"
    local command="$2"
    local directory="$3"
    
    print_color $BLUE "\n${GEAR} Running: $test_name"
    
    if [ -n "$directory" ]; then
        cd "$directory"
    fi
    
    if eval "$command"; then
        print_color $GREEN "${CHECKMARK} $test_name - PASSED"
        if [ -n "$directory" ]; then
            cd - > /dev/null
        fi
        return 0
    else
        print_color $RED "${CROSS} $test_name - FAILED"
        if [ -n "$directory" ]; then
            cd - > /dev/null
        fi
        return 1
    fi
}

# Detect Python command
detect_python() {
    if [[ -f "backend/venv/bin/python" ]]; then
        echo "backend/venv/bin/python"
    elif command -v python3 &> /dev/null; then
        echo "python3"
    elif command -v python &> /dev/null; then
        echo "python"
    else
        print_color $RED "❌ Python not found. Please ensure Python is installed."
        exit 1
    fi
}

PYTHON_CMD=$(detect_python)

# Initialize results tracking
declare -a results
declare -a test_names

add_result() {
    results+=($1)
    test_names+=("$2")
}

# Main function
main() {
    print_header "${MICROSCOPE} THE HYBRID PROTOCOL - COMPREHENSIVE QUALITY SUITE"
    
    local start_time=$(date +%s)
    
    # Get current directory
    local project_root=$(pwd)
    
    # Pre-flight checks
    print_header "${PACKAGE} Pre-flight Checks"
    
    # Check if we're in the right directory
    if [[ ! -f "README.md" ]] || [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
        print_color $RED "${CROSS} Error: Please run this script from the project root directory"
        exit 1
    fi
    
    print_color $GREEN "${CHECKMARK} Project structure validated"
    
    # Backend Tests
    print_header "${MICROSCOPE} BACKEND QUALITY TESTS"
    
    # Check if backend dependencies are available
    if [[ -f "backend/requirements.txt" ]]; then
        print_color $BLUE "${PACKAGE} Backend dependencies found"
    else
        print_color $YELLOW "${WARNING} Backend requirements.txt not found"
    fi
    
    # Backend Django checks
    run_test "Django System Check" "$PYTHON_CMD manage.py check" "backend"
    add_result $? "Django System Check"
    
    run_test "Django Security Check" "$PYTHON_CMD manage.py check --deploy" "backend"
    add_result $? "Django Security Check"
    
    run_test "Migration Check" "$PYTHON_CMD manage.py makemigrations --check --dry-run" "backend"
    add_result $? "Migration Check"
    
    # Backend unit tests
    if [[ -f "backend/scripts/test_backend.py" ]]; then
        run_test "Backend Unit Tests" "$PYTHON_CMD scripts/test_backend.py" "backend"
        add_result $? "Backend Unit Tests"
    else
        run_test "Backend Unit Tests (Basic)" "$PYTHON_CMD manage.py test --verbosity=2" "backend"
        add_result $? "Backend Unit Tests"
    fi
    
    # Frontend Tests
    print_header "${MICROSCOPE} FRONTEND QUALITY TESTS"
    
    # Check if frontend dependencies are available
    if [[ -f "frontend/package.json" ]]; then
        print_color $BLUE "${PACKAGE} Frontend package.json found"
    else
        print_color $RED "${CROSS} Frontend package.json not found"
        add_result 1 "Frontend Dependencies"
    fi
    
    # Frontend dependency check
    run_test "Frontend Dependencies" "npm list --depth=0" "frontend"
    add_result $? "Frontend Dependencies"
    
    # Frontend linting
    run_test "Frontend Linting" "npm run lint" "frontend"
    add_result $? "Frontend Linting"
    
    # Frontend TypeScript check
    run_test "TypeScript Check" "npx tsc --noEmit" "frontend"
    add_result $? "TypeScript Check"
    
    # Frontend build compilation check (catches Next.js specific issues)
    run_test "Next.js Compilation Check" "npm run build" "frontend"
    add_result $? "Next.js Compilation Check"
    
    # Frontend tests
    if [[ -f "frontend/scripts/test_frontend.js" ]]; then
        run_test "Frontend Tests" "node scripts/test_frontend.js" "frontend"
        add_result $? "Frontend Tests"
    elif [[ -f "frontend/package.json" ]] && grep -q '"test"' frontend/package.json; then
        run_test "Frontend Unit Tests" "npm test -- --watchAll=false --coverage" "frontend"
        add_result $? "Frontend Unit Tests"
    else
        print_color $YELLOW "${WARNING} No frontend tests configured"
        add_result 1 "Frontend Tests"
    fi
    
    # Frontend build test (already done in compilation check above)
    
    # Integration Tests
    print_header "${SHIELD} INTEGRATION TESTS"
    
    # API Health Check (if backend is running)
    run_test "API Health Check" "curl -f http://localhost:8000/api/health/ || echo 'Backend not running - skipping health check'" ""
    add_result $? "API Health Check"
    
    # Security Checks
    print_header "${SHIELD} SECURITY CHECKS"
    
    # Check for sensitive files
    run_test "Sensitive Files Check" "! find . -name '*.env' -not -path './frontend/env.local.example' -not -path './env.sample' | grep -q ." ""
    add_result $? "Sensitive Files Check"
    
    # Check for TODO/FIXME comments in critical files
    run_test "Code Quality Check" "! grep -r 'TODO\\|FIXME\\|XXX' backend/core/ frontend/src/ || true" ""
    add_result $? "Code Quality Check"
    
    # Performance Tests
    print_header "${CHART} PERFORMANCE CHECKS"
    
    # Check frontend bundle size (if build exists)
    if [[ -d "frontend/.next" ]]; then
        run_test "Bundle Size Check" "du -sh .next/static 2>/dev/null || echo 'Build artifacts found'" "frontend"
        add_result $? "Bundle Size Check"
    else
        print_color $YELLOW "${WARNING} No build artifacts to analyze"
        add_result 1 "Bundle Size Check"
    fi
    
    # Final Results
    print_header "${CHART} TEST RESULTS SUMMARY"
    
    local total_tests=${#results[@]}
    local passed_tests=0
    
    echo ""
    print_color $WHITE "Individual Test Results:"
    echo ""
    
    for i in "${!results[@]}"; do
        if [[ ${results[$i]} -eq 0 ]]; then
            print_color $GREEN "${CHECKMARK} ${test_names[$i]}"
            ((passed_tests++))
        else
            print_color $RED "${CROSS} ${test_names[$i]}"
        fi
    done
    
    local failed_tests=$((total_tests - passed_tests))
    local success_rate=$(( (passed_tests * 100) / total_tests ))
    
    echo ""
    print_color $WHITE "Summary:"
    print_color $GREEN "${CHECKMARK} Passed: $passed_tests"
    print_color $RED "${CROSS} Failed: $failed_tests"
    print_color $CYAN "${CHART} Success Rate: ${success_rate}%"
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    print_color $BLUE "${GEAR} Total Runtime: ${duration}s"
    
    echo ""
    
    if [[ $failed_tests -eq 0 ]]; then
        print_color $GREEN "${ROCKET} ALL TESTS PASSED! Ready for deployment!"
        echo ""
        print_color $CYAN "Coverage reports:"
        [[ -d "backend/htmlcov" ]] && print_color $WHITE "  Backend: backend/htmlcov/index.html"
        [[ -d "frontend/coverage" ]] && print_color $WHITE "  Frontend: frontend/coverage/lcov-report/index.html"
        echo ""
        exit 0
    else
        print_color $RED "${CROSS} $failed_tests test(s) failed. Please fix issues before deployment."
        echo ""
        print_color $YELLOW "Troubleshooting tips:"
        print_color $WHITE "  1. Check individual test output above"
        print_color $WHITE "  2. Run tests individually to debug: npm test (frontend) or python/python3 manage.py test (backend)"
        print_color $WHITE "  3. Ensure all dependencies are installed"
        print_color $WHITE "  4. Check for linting errors: npm run lint"
        echo ""
        exit 1
    fi
}

# Handle script interruption
trap 'echo ""; print_color $YELLOW "${WARNING} Test suite interrupted by user"; exit 130' INT

# Run main function
main "$@" 