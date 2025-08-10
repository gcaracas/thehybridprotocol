# The Hybrid Protocol

A modern full-stack health brand website with Django REST API backend and Next.js frontend.

## 🎯 Overview

The Hybrid Protocol bridges the gap between science and practice in health, wellness, and human performance. This platform features:

- **Django REST API Backend** for managing newsletter articles, podcast episodes, and email signups
- **Next.js Frontend** with responsive design and modern UI
- **PostgreSQL Database** for production-ready data storage
- **Railway Deployment** ready with monorepo configuration
- **Newsletter Agent System** with Celery background tasks and Postmark email delivery

## 🏗️ Project Structure

```
thehybridprotocol/
├── backend/              # Django REST API
│   ├── core/            # Main Django app with models and API endpoints
│   │   ├── email_providers/  # Email provider implementations
│   │   ├── utils/       # Email utilities and helpers
│   │   └── tasks.py     # Celery background tasks
│   ├── templates/       # Email templates
│   ├── thehybridprotocol/ # Django project settings
│   └── manage.py        # Django management script
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   └── components/  # Reusable React components
│   └── package.json     # Frontend dependencies
└── env.sample          # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL (for production)
- Redis (for Celery)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp ../env.sample .env
   # Edit .env with your configuration
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

   **Note:** Always activate the virtual environment before working on the backend:
   ```bash
   source venv/bin/activate
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.local.example .env.local
   # Edit .env.local with your API URL
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 📧 Newsletter Agent System

### Features

- **Background Email Sending** - Celery tasks for reliable email delivery
- **Batch Processing** - Send to multiple recipients efficiently
- **Retry Logic** - Automatic retries on failures
- **Email Tracking** - Log delivery status and errors
- **Unsubscribe Support** - One-click unsubscribe with signed tokens
- **Provider Agnostic** - Easy to swap email providers (Postmark, SendGrid, etc.)

### Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_PROVIDER=postmark
EMAIL_API_KEY=your_postmark_api_key
EMAIL_FROM=hello@thehybridprotocol.com
PUBLIC_FRONTEND_URL=http://localhost:3000

# Celery/Redis Configuration
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Running the Newsletter Agent

1. **Start Redis server:**
   ```bash
   redis-server
   ```

2. **Start Celery worker:**
   ```bash
   cd backend
   source venv/bin/activate
   celery -A thehybridprotocol worker -l info
   ```

3. **Start Celery beat (for scheduled tasks):**
   ```bash
   celery -A thehybridprotocol beat -l info
   ```

### Using the Newsletter System

1. **Create a Newsletter:**
   - Go to Django Admin → Newsletters
   - Fill in title, subject, content, and other fields
   - Set status to "Published"

2. **Send Newsletter:**
   - Select the newsletter in admin
   - Use "Send newsletter to subscribers" action
   - Monitor progress in Celery worker logs

3. **Test Newsletter:**
   - Use "Send test newsletter" action
   - Enter test email address
   - Check delivery status

### Email Templates

- **Newsletter Template:** `templates/email/newsletter.html`
- **Unsubscribe Success:** `templates/email/unsubscribe_success.html`
- **Unsubscribe Error:** `templates/email/unsubscribe_error.html`

## 📊 API Endpoints

The Django backend provides the following REST API endpoints:

- `GET /api/` - API information
- `GET /api/health/` - Health check
- `GET /api/newsletters/` - List published newsletter articles
- `GET /api/newsletters/{slug}/` - Get specific newsletter article
- `POST /api/newsletters/{id}/send-test/` - Send test newsletter
- `GET /api/podcast-episodes/` - List published podcast episodes
- `GET /api/podcast-episodes/{slug}/` - Get specific podcast episode
- `POST /api/email-signup/` - Create email newsletter signup
- `GET /api/unsubscribe/` - Unsubscribe from newsletters

## 🗄️ Database Models

### Newsletter
- Title, slug, subject, preheader, content, excerpt
- Featured image URL
- Publication status and timestamps
- Send tracking (send_key, sent_at)

### EmailSignup (Recipients)
- Email, first name, last name
- Subscription status (is_subscribed, bounce)
- Source tracking and confirmation timestamps

### EmailLog
- Newsletter and recipient relationships
- Delivery status (queued/sent/failed)
- Provider message IDs and error tracking

## 🎨 Frontend Features

- **Responsive Design** - Mobile-first with TailwindCSS
- **Navigation** - Mobile hamburger menu with smooth transitions
- **Hero Section** - Compelling brand introduction
- **Podcast Grid** - Displays latest episodes with YouTube integration
- **Newsletter Signup** - Form connected to Django API
- **Error Handling** - User-friendly error messages and loading states

## 🚢 Deployment

### Railway Deployment

This project is configured for Railway deployment with automatic environment detection:

1. **Connect Repository** to Railway
2. **Create Four Services:**
   - **Backend Service**: Point to `/backend` directory
   - **Frontend Service**: Point to `/frontend` directory
   - **Worker Service**: Point to `/backend` directory with `railway-worker.toml` config
   - **Redis Service**: Add Redis database

3. **Set Environment Variables** for Backend Service:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-railway-domain.railway.app
   BASE_URL=https://your-backend-domain.railway.app
   DATABASE_URL=postgresql://... (provided by Railway PostgreSQL)
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app
   EMAIL_PROVIDER=postmark
   EMAIL_API_KEY=your_postmark_api_key
   EMAIL_FROM=hello@thehybridprotocol.com
   PUBLIC_FRONTEND_URL=https://your-frontend-domain.railway.app
   NEWSLETTER_VIEW_PATH=/newsletter-single
   BATCH_SIZE=500
   RATE_SLEEP_SEC=0.5
   POSTMARK_WEBHOOK_TOKEN=your_random_long_secret_for_webhooks
   REDIS_URL=redis://:password@redis.railway.internal:6379/0
   CELERY_BROKER_URL=${REDIS_URL}
   CELERY_RESULT_BACKEND=${REDIS_URL}
   ```

4. **Set Environment Variables** for Frontend Service:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
   ```

5. **Set Environment Variables** for Worker Service (same as Backend):
   ```env
   # Copy all backend environment variables including:
   # BASE_URL, PUBLIC_FRONTEND_URL, NEWSLETTER_VIEW_PATH, BATCH_SIZE, RATE_SLEEP_SEC, POSTMARK_WEBHOOK_TOKEN
   # The worker will automatically start with: celery -A thehybridprotocol worker -l info --concurrency=2
   ```

6. **Add PostgreSQL Database** to your Railway project

7. **Configure Worker Service:**
   - Set **Serverless** to **OFF** (important!)
   - The worker will automatically start using the `railway-worker.toml` configuration
   - Monitor worker logs in Railway dashboard

**Note**: The backend is configured to automatically handle static files and database migrations on deployment.

### Testing the Newsletter System

1. **Create a test recipient:**
   ```bash
   # In Django admin or via shell
   python manage.py shell
   from core.models import EmailSignup
   EmailSignup.objects.create(email='test@example.com', first_name='Test', last_name='User')
   ```

2. **Create and publish a newsletter:**
   - Go to Django admin → Newsletters
   - Create a new newsletter with subject, content, and set status to 'published'
   - Save the newsletter

3. **Send test email:**
   - In the newsletter list, select your newsletter
   - Use the "Send test newsletter to admin" action
   - Check your email for the test message

4. **Monitor logs:**
   - Check EmailLog in Django admin for send status
   - Monitor Celery worker logs in Railway dashboard

### Postmark Webhook Setup

1. **Configure bounce webhook in Postmark:**
   - Go to Postmark dashboard → Sending → Webhooks
   - Add webhook URL: `https://your-backend-domain.railway.app/api/webhooks/postmark/your_token/`
   - Select events: Bounce, Spam Complaint
   - Use the same token as `POSTMARK_WEBHOOK_TOKEN` environment variable

2. **Test webhook:**
   - Send a test email to an invalid address
   - Check that the recipient is marked as bounced in Django admin

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# PostgreSQL Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=thehybridprotocol
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Email Configuration
EMAIL_PROVIDER=postmark
EMAIL_API_KEY=your_postmark_api_key
EMAIL_FROM=hello@thehybridprotocol.com
PUBLIC_FRONTEND_URL=https://yourdomain.com

# Celery/Redis Configuration
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# CORS Settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Security (Production)
SECURE_SSL_REDIRECT=True
```

## 🛠️ Development

### Backend Commands

```bash
# Create new Django app
python3 manage.py startapp appname

# Make migrations
python3 manage.py makemigrations

# Apply migrations
python3 manage.py migrate

# Create superuser
python3 manage.py createsuperuser

# Run development server
python3 manage.py runserver

# Start Celery worker
celery -A thehybridprotocol worker -l info

# Start Celery beat
celery -A thehybridprotocol beat -l info
```

### Frontend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🔧 Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API framework
- **Celery 5.3** - Background task processing
- **Redis** - Message broker and result backend
- **Postmark** - Email delivery service
- **PostgreSQL** - Database
- **WhiteNoise** - Static file serving

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Heroicons** - Icons

## 📝 Testing the Newsletter System

1. **Create Test Recipient:**
   ```bash
   # Via Django shell
   python manage.py shell
   from core.models import EmailSignup
   EmailSignup.objects.create(email='test@example.com', first_name='Test', last_name='User')
   ```

2. **Create Test Newsletter:**
   - Go to Django Admin → Newsletters
   - Create newsletter with subject and content
   - Set status to "Published"

3. **Send Test Email:**
   - Use "Send test newsletter" action
   - Enter your email address
   - Check inbox for test email

4. **Monitor Logs:**
   - Check Celery worker output
   - View EmailLog entries in admin
   - Check Postmark dashboard for delivery status

## 🚨 Troubleshooting

### Common Issues

1. **Celery Worker Not Starting:**
   - Ensure Redis is running
   - Check REDIS_URL environment variable
   - Verify Celery configuration in settings.py

2. **Emails Not Sending:**
   - Check EMAIL_API_KEY is set correctly
   - Verify EMAIL_FROM address is authorized
   - Check Postmark account status

3. **Migration Errors:**
   - Run `python manage.py migrate --fake-initial` if needed
   - Check for conflicting migrations

4. **Template Errors:**
   - Ensure templates are in correct directory
   - Check template syntax and variables

## 📚 Additional Resources

- [Celery Documentation](https://docs.celeryproject.org/)
- [Postmark API Documentation](https://postmarkapp.com/developer/api)
- [Django Email Documentation](https://docs.djangoproject.com/en/4.2/topics/email/)
- [Railway Deployment Guide](https://docs.railway.app/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
