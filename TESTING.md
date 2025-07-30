# 🧪 Testing & Quality Assurance Guide

This document outlines the comprehensive testing and quality assurance system for The Hybrid Protocol project.

## 🎯 Overview

Our testing system provides **robust quality gates** to ensure code reliability, performance, and security before deployment. It includes:

- ✅ **Unit Tests** - Backend (Django) and Frontend (React/Next.js)
- ✅ **Integration Tests** - API endpoints and user flows  
- ✅ **Quality Checks** - Linting, type checking, security
- ✅ **Automated Git Hooks** - Pre-commit and pre-push validation
- ✅ **Coverage Reports** - Detailed test coverage analysis
- ✅ **Performance Tests** - Bundle size and build validation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
pip install -r requirements.txt
pip install coverage  # For test coverage

# Frontend dependencies  
cd ../frontend
npm install
```

### 2. Set Up Git Hooks

```bash
# From project root
./scripts/setup_git_hooks.sh
```

### 3. Run All Tests

```bash
# Comprehensive test suite (recommended)
./test_all.sh

# Or run individual components
cd backend && python scripts/test_backend.py
cd frontend && node scripts/test_frontend.js
```

## 📋 Testing Components

### Backend Testing (Django)

**Location**: `backend/core/test_*.py`

**Test Types**:
- **Models** (`test_models.py`) - Data validation, methods, properties
- **Serializers** (`test_serializers.py`) - API data transformation
- **Views/APIs** (`test_api.py`) - Endpoint behavior, permissions
- **Management Commands** (`test_management_commands.py`) - Custom commands

**Run Backend Tests**:
```bash
cd backend

# All tests with coverage
python scripts/test_backend.py

# Individual test files
python manage.py test core.test_models --verbosity=2
python manage.py test core.test_api --verbosity=2

# Fast tests (with optimized settings)
python manage.py test --settings=test_settings --verbosity=2
```

**Coverage Reports**:
```bash
cd backend
coverage run --source=. manage.py test
coverage report --show-missing
coverage html  # Creates htmlcov/index.html
```

### Frontend Testing (React/Next.js)

**Location**: `frontend/src/components/__tests__/`

**Test Types**:
- **Component Tests** - Rendering, user interactions, props
- **Integration Tests** - API calls, routing, state management
- **Accessibility Tests** - Screen reader compatibility
- **Performance Tests** - Bundle size, rendering speed

**Run Frontend Tests**:
```bash
cd frontend

# All tests with coverage
node scripts/test_frontend.js

# Individual test commands
npm test                    # Interactive mode
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:ci           # CI mode (no watch)
```

**Test File Patterns**:
- `*.test.tsx` - Component tests
- `*.spec.tsx` - Integration tests
- `__tests__/` - Test directories

## 🔧 Quality Checks

### Code Quality

**ESLint** (Frontend):
```bash
cd frontend
npm run lint              # Check for issues
npm run lint -- --fix    # Auto-fix issues
```

**Django Checks** (Backend):
```bash
cd backend
python manage.py check                # System check
python manage.py check --deploy       # Security check
python manage.py makemigrations --check --dry-run  # Migration check
```

### Security Checks

**Built into test scripts**:
- Sensitive file detection (`.env` files)
- Merge conflict marker detection
- Security deployment checks
- Dependency vulnerability scanning

### Performance Checks

**Bundle Analysis**:
```bash
cd frontend
npm run build             # Create production build
npm run analyze          # Analyze bundle size (if configured)
```

**Database Performance**:
```bash
cd backend
python manage.py shell -c "
from django.db import connection
from django.test.utils import override_settings
# Test query performance
"
```

## 🛡️ Git Hooks (Automatic Quality Gates)

### Pre-Commit Hook
Runs **before** each commit:
- ✅ Frontend linting (ESLint)
- ✅ Backend Django system checks
- ✅ Merge conflict detection
- ✅ Code style validation

**Bypass** (use sparingly):
```bash
git commit --no-verify -m "emergency fix"
```

### Pre-Push Hook
Runs **before** each push:
- ✅ **Full test suite** (`./test_all.sh`)
- ✅ Build validation
- ✅ Coverage thresholds
- ✅ Security checks

**Bypass** (use very sparingly):
```bash
git push --no-verify
```

## 📊 Coverage Requirements

### Backend (Django)
- **Minimum**: 70% line coverage
- **Target**: 85% line coverage
- **Focus**: Models, views, serializers

### Frontend (React)
- **Minimum**: 70% line coverage  
- **Target**: 80% line coverage
- **Focus**: Components, user interactions

## 🎛️ Configuration Files

### Backend
- `backend/test_settings.py` - Optimized test settings
- `backend/core/tests.py` - Test discovery
- `backend/.coveragerc` - Coverage configuration

### Frontend  
- `frontend/jest.config.js` - Jest configuration
- `frontend/jest.setup.js` - Test environment setup
- `frontend/package.json` - Test scripts

## 🚨 Troubleshooting

### Common Issues

**1. Tests fail with "Module not found"**
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend  
cd frontend && npm install
```

**2. Next.js 15 TypeScript errors (async params)**
```bash
# Error: Type '{ slug: string; }' is missing properties from 'Promise<any>'
# Fix: Update dynamic route pages to use Promise<{ param: type }>

# Before (Next.js 14)
export default async function Page({ params }: { params: { slug: string } }) {
  const episode = await getEpisode(params.slug);
}

# After (Next.js 15)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisode(slug);
}
```

**3. Database errors in tests**
```bash
cd backend
python manage.py migrate
python manage.py test --settings=test_settings
```

**4. Frontend build fails**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

**5. Git hooks not working**
```bash
# Reinstall hooks
./scripts/setup_git_hooks.sh

# Check hook permissions
ls -la .git/hooks/
```

### Test Performance

**Slow Backend Tests**:
- Use `--settings=test_settings` for faster execution
- Use in-memory SQLite database
- Disable unnecessary middleware

**Slow Frontend Tests**:
- Use `--passWithNoTests` for missing test files
- Mock external dependencies
- Use shallow rendering when possible

## 🔄 CI/CD Integration

### Local Development
```bash
# Before committing
./test_all.sh

# Quick checks
npm run lint (frontend)
python manage.py check (backend)
```

### Deployment Pipeline
```bash
# Production readiness check
./test_all.sh
cd frontend && npm run build
cd backend && python manage.py check --deploy
```

## 📈 Best Practices

### Writing Tests

**1. Test Structure**:
```python
# Backend - Django
class MyModelTest(TestCase):
    def setUp(self):
        # Test data setup
        
    def test_specific_behavior(self):
        # Arrange, Act, Assert
```

```javascript
// Frontend - React/Jest
describe('Component Name', () => {
  test('should render correctly', () => {
    // Arrange, Act, Assert
  });
});
```

**2. Test Naming**:
- Use descriptive test names
- Include expected behavior
- Group related tests

**3. Test Coverage**:
- Aim for high coverage but focus on critical paths
- Test edge cases and error conditions
- Mock external dependencies

### Maintaining Tests

**1. Regular Updates**:
- Update tests when features change
- Remove obsolete tests
- Keep test data relevant

**2. Performance**:
- Keep tests fast and focused
- Use appropriate test doubles (mocks, stubs)
- Clean up test data

**3. Reliability**:
- Avoid flaky tests
- Use deterministic test data
- Handle async operations properly

## 📚 Resources

- [Django Testing Documentation](https://docs.djangoproject.com/en/stable/topics/testing/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎉 Success Metrics

**Quality Gates Passed**:
- ✅ All tests pass
- ✅ Coverage thresholds met
- ✅ No linting errors
- ✅ Security checks pass
- ✅ Build succeeds

**When you see**: `🚀 ALL TESTS PASSED! Ready for deployment!`

**Your code is ready for production! 🎉** 