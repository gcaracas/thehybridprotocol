#!/bin/bash

# Local deployment script for The Hybrid Protocol
# ALWAYS runs data migrations on every deployment

echo "🚀 Starting local deployment with data migrations..."
echo "=================================================="

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "❌ Virtual environment not activated. Please run:"
    echo "   source venv/bin/activate"
    exit 1
fi

# Check if we're in the backend directory
if [[ ! -f "manage.py" ]]; then
    echo "❌ Not in backend directory. Please run from backend folder."
    exit 1
fi

# Run the deployment script
echo "🔧 Running deployment script..."
python scripts/deploy_local.py

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Local deployment completed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "   • Run: python manage.py runserver"
    echo "   • Visit: http://localhost:8000/admin"
    echo "   • Check the new models in Django admin"
else
    echo ""
    echo "❌ Local deployment failed!"
    exit 1
fi 