#!/bin/bash

# Deploy migrations to Railway
echo "🚀 Deploying migrations to Railway..."

# Check if Railway CLI is logged in
if ! railway status > /dev/null 2>&1; then
    echo "❌ Not logged in to Railway. Please run: railway login"
    echo "Then run this script again."
    exit 1
fi

# Run migrations
echo "📦 Running migrations..."
railway run python manage.py migrate

echo "✅ Migrations deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Check the Railway dashboard to ensure migrations ran successfully"
echo "2. Test the new models in Django admin"
echo "3. Create some sample data for testing" 