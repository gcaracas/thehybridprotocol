# Deployment Guide - The Hybrid Protocol

## 🚀 Data Migrations Always Run

**IMPORTANT**: Data migrations are **ALWAYS** run on every deployment, both locally and on Railway. This ensures your database schema and sample data are always up to date.

## 📋 Deployment Process

Every deployment includes these steps in order:

1. **Database Connection Test** 🔍
2. **Media Directories Creation** 📁
3. **Django Migrations** 📦
4. **Sample Data Population** 📝
5. **Admin User Creation** 👤
6. **Static Files Collection** 📄
7. **Application Start** 🚀

## 🏠 Local Deployment

### Quick Deploy
```bash
# From backend directory with virtual environment activated
./deploy_local.sh
```

### Manual Deploy
```bash
# From backend directory with virtual environment activated
python scripts/deploy_local.py
```

### After Deployment
```bash
# Start the development server
python manage.py runserver

# Visit Django admin
# http://localhost:8000/admin
```

## ☁️ Railway Deployment

### Automatic Deployment
Railway automatically runs data migrations on every deployment using:
- `scripts/deploy_railway.py` - Main deployment script
- `railway.toml` - Railway configuration

### Manual Railway Deploy
```bash
# Deploy to Railway (requires railway login)
railway up

# Check deployment logs
railway logs
```

## 📊 Database Models

The following models are created and populated with sample data:

### LocalizedElement
- Stores English/Spanish text pairs
- Used by Categories, Tags, and TextWidgets
- Sample data: 13 elements created

### Category
- Content categories with localized names
- Sample data: 5 categories (Branding, Design, Development, Photography, Other)

### Tag
- Content tags with localized names
- Sample data: 8 tags (Design, Portfolio, Digital, Branding, Theme, Clean, UI & UX, Love)

### Archive
- Archive entries with month/year and counts
- Sample data: 3 archives (February 2021, January 2021, December 2020)

### TextWidget
- Text widgets with localized titles and content
- Sample data: 1 widget with sample content

## 🔧 Scripts Overview

### `scripts/deploy_local.py`
- Local deployment script
- Always runs data migrations
- Creates media directories
- Populates sample data
- Collects static files

### `scripts/deploy_railway.py`
- Railway deployment script
- Same functionality as local script
- Optimized for Railway environment
- Handles Railway-specific paths

### `scripts/populate_sample_data.py`
- Populates database with sample data
- Idempotent operations (won't create duplicates)
- Creates localized elements, categories, tags, archives, and widgets

### `deploy_local.sh`
- Simple shell script for local deployment
- Checks virtual environment and directory
- Runs the Python deployment script

## 🚨 Troubleshooting

### Database Connection Issues
```bash
# Check database settings
python manage.py check

# Test database connection
python manage.py dbshell
```

### Migration Issues
```bash
# Show migration status
python manage.py showmigrations

# Reset migrations (DANGER: will lose data)
python manage.py migrate core zero
python manage.py migrate
```

### Sample Data Issues
```bash
# Run sample data script manually
python scripts/populate_sample_data.py

# Check existing data
python manage.py shell
# >>> from core.models import LocalizedElement, Category, Tag, Archive, TextWidget
# >>> LocalizedElement.objects.count()
```

## 📝 Adding New Data

When you add new models or need new sample data:

1. **Update the model** in `core/models.py`
2. **Create migrations**: `python manage.py makemigrations`
3. **Update sample data script** in `scripts/populate_sample_data.py`
4. **Deploy**: Data migrations will automatically run

## 🎯 Best Practices

- **Always run data migrations** on deployment
- **Test locally first** before deploying to Railway
- **Check deployment logs** for any errors
- **Verify data** in Django admin after deployment
- **Backup database** before major schema changes

## 📞 Support

If deployment fails:
1. Check the error logs
2. Verify database connection
3. Ensure all dependencies are installed
4. Check file permissions
5. Review the deployment script output 