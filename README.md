# The Hybrid Protocol

A modern full-stack health brand website with Django REST API backend and Next.js frontend.

## 🎯 Overview

The Hybrid Protocol bridges the gap between science and practice in health, wellness, and human performance. This platform features:

- **Django REST API Backend** for managing newsletter articles, podcast episodes, and email signups
- **Next.js Frontend** with responsive design and modern UI
- **PostgreSQL Database** for production-ready data storage
- **Railway Deployment** ready with monorepo configuration

## 🏗️ Project Structure

```
thehybridprotocol/
├── backend/              # Django REST API
│   ├── core/            # Main Django app with models and API endpoints
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

## 📊 API Endpoints

The Django backend provides the following REST API endpoints:

- `GET /api/` - API information
- `GET /api/health/` - Health check
- `GET /api/newsletters/` - List published newsletter articles
- `GET /api/newsletters/{slug}/` - Get specific newsletter article
- `GET /api/podcast-episodes/` - List published podcast episodes
- `GET /api/podcast-episodes/{slug}/` - Get specific podcast episode
- `POST /api/email-signup/` - Create email newsletter signup

## 🗄️ Database Models

### Newsletter
- Title, slug, content, excerpt
- Featured image URL
- Publication status and timestamps

### PodcastEpisode
- Title, slug, description, episode number
- Duration, audio URL
- YouTube, Spotify, Apple Podcasts URLs
- Thumbnail image

### EmailSignup
- Email, first name, last name
- Subscription source tracking
- Active status and confirmation timestamps

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
2. **Set Environment Variables** in Railway dashboard
3. **Deploy** both services:
   - Backend service: Django API
   - Frontend service: Next.js app

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
- **Django REST Framework** - API development
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **django-cors-headers** - CORS handling
- **python-decouple** - Environment configuration

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Hooks** - State management

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact the development team.
The Hybrid Protocol main website
