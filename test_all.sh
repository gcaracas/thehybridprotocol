ok#!/bin/bash

# Critical Railway Deployment Tests for The Hybrid Protocol
# Fast, essential tests that can prevent deployment failures
# Used by pre-push git hook

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to print colored output
print_color() {
    printf "%s%s%s\n" "${1}" "${2}" "${NC}"
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

# Detect Python command for backend
detect_python() {
    if [[ -f "backend/venv/bin/python" ]]; then
        echo "venv/bin/python"
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
    print_header "${MICROSCOPE} THE HYBRID PROTOCOL - CRITICAL DEPLOYMENT TESTS"
    
    local start_time=$(date +%s)
    
    # Pre-flight checks
    print_header "${SHIELD} Pre-flight Checks"
    
    # Check if we're in the right directory
    if [[ ! -f "README.md" ]] || [[ ! -d "backend" ]]; then
        print_color $RED "${CROSS} Error: Please run this script from the project root directory"
        exit 1
    fi
    
    print_color $GREEN "${CHECKMARK} Project structure validated"
    
    # CRITICAL BACKEND TESTS (Railway deployment blockers)
    print_header "${MICROSCOPE} CRITICAL BACKEND TESTS"
    
    # 1. Django System Check - Critical for deployment
    run_test "Django System Check" "$PYTHON_CMD manage.py check" "backend"
    add_result $? "Django System Check"
    
    # 2. Migration Check - Prevents deployment failures
    run_test "Migration Check" "$PYTHON_CMD manage.py makemigrations --check --dry-run" "backend"
    add_result $? "Migration Check"
    
    # 3. Critical Unit Tests - Core functionality
    run_test "Critical Unit Tests" "$PYTHON_CMD manage.py test core.test_models core.test_serializers --verbosity=1" "backend"
    add_result $? "Critical Unit Tests"
    
    # 4. API Tests - Essential for Railway deployment
    run_test "API Tests" "$PYTHON_CMD manage.py test core.test_api --verbosity=1" "backend"
    add_result $? "API Tests"
    
    # CRITICAL FRONTEND TESTS (Railway deployment blockers)
    print_header "${MICROSCOPE} CRITICAL FRONTEND TESTS"
    
    # 1. Frontend Build Test - Critical for deployment
    if [[ -f "hybridprotocol-frontend/package.json" ]]; then
        run_test "Frontend Build Test" "npm run build" "hybridprotocol-frontend"
        add_result $? "Frontend Build Test"
    else
        print_color $YELLOW "${WARNING} Frontend not found - skipping build test"
        add_result 0 "Frontend Build Test"
    fi
    
    # 2. Frontend Linting - Code quality for deployment
    if [[ -f "hybridprotocol-frontend/package.json" ]]; then
        run_test "Frontend Linting" "npm run lint" "hybridprotocol-frontend"
        add_result $? "Frontend Linting"
    else
        print_color $YELLOW "${WARNING} Frontend not found - skipping linting"
        add_result 0 "Frontend Linting"
    fi
    
    # CRITICAL SECURITY CHECKS (Railway deployment blockers)
    print_header "${SHIELD} CRITICAL SECURITY CHECKS"
    
    # 1. Sensitive Files Check - Prevents secrets in deployment
    run_test "Sensitive Files Check" "! find . -name '*.env' -not -path './hybridprotocol-frontend/env.local.example' -not -path './env.sample' | grep -q ." ""
    add_result $? "Sensitive Files Check"
    
    # 2. Merge Conflict Check - Prevents broken deployments
    run_test "Merge Conflict Check" "! grep -r '<<<<<<< HEAD\\|=======\\|>>>>>>> ' --include='*.py' --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' --exclude-dir='node_modules' --exclude-dir='venv' --exclude-dir='.next' . 2>/dev/null" ""
    add_result $? "Merge Conflict Check"
    
    # Final Results
    print_header "${CHART} CRITICAL TEST RESULTS"
    
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
        print_color $GREEN "${ROCKET} ALL CRITICAL TESTS PASSED! Ready for Railway deployment!"
        echo ""
        print_color $CYAN "Next steps:"
        print_color $WHITE "  • Run './qual.sh' for comprehensive quality analysis"
        print_color $WHITE "  • Deploy to Railway with confidence"
        echo ""
        exit 0
    else
        print_color $RED "${CROSS} $failed_tests critical test(s) failed. Railway deployment blocked."
        echo ""
        print_color $YELLOW "Critical issues to fix:"
        print_color $WHITE "  1. Fix Django system errors"
        print_color $WHITE "  2. Resolve migration conflicts"
        print_color $WHITE "  3. Fix API endpoint issues"
        print_color $WHITE "  4. Resolve frontend build errors"
        print_color $WHITE "  5. Remove sensitive files from repository"
        echo ""
        exit 1
    fi
}

# Handle script interruption
trap 'echo ""; print_color $YELLOW "${WARNING} Critical tests interrupted by user"; exit 130' INT

# Run main function
main "$@" 