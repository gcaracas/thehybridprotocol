# The Hybrid Protocol Frontend

A clean, modern frontend for The Hybrid Protocol built with Next.js.

## Structure

```
hybridprotocol-frontend/
├── app/                          # Next.js App Router pages
│   ├── page.jsx                  # Homepage (elegant multi-page)
│   ├── newsletter/               # Newsletter listing page
│   ├── podcasts/                 # Podcasts listing page
│   ├── newsletter-single/[slug]/ # Individual newsletter articles
│   └── podcasts-single/[slug]/   # Individual podcast episodes
├── components/                   # React components
│   ├── headers/                  # Header components
│   ├── footers/                  # Footer components
│   ├── common/                   # Shared components
│   └── homes/                    # Homepage sections
├── data/                        # Static data and configuration
├── public/assets/               # Static assets (CSS, images, fonts)
├── utlis/                       # Utility functions
└── env.local.example           # Environment variables template
```

## Pages

- **Homepage** (`/`): Elegant multi-page design with hero section and content sections
- **Newsletter** (`/newsletter`): List of newsletter articles (will connect to API)
- **Podcasts** (`/podcasts`): List of podcast episodes (will connect to API)
- **Individual Articles**: Dynamic routes for individual newsletter and podcast content

## Technology Stack

- **Next.js 15.1.6**: React framework with App Router
- **Bootstrap 5.1.3**: CSS framework for styling
- **JavaScript**: No TypeScript (keeping it simple)
- **Railway**: Deployment platform

## Environment Variables

Copy `env.local.example` to `.env.local` and configure:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://thehybridprotocol-production.up.railway.app

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Integration Status

- ✅ Environment configuration ready
- ✅ Image domains configured for Railway
- ⏳ Newsletter page API integration pending
- ⏳ Podcasts page API integration pending
- ⏳ Individual article pages API integration pending
- ⏳ Newsletter signup forms API integration pending

## Deployment

Configured for Railway deployment with:
- NIXPACKS builder
- Automatic restart on failure
- Environment variable support
