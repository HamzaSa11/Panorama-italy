# PANORAMA Cleaning Services - Booking System

## Overview

PANORAMA is a booking and contact management system for a Bolzano-based professional cleaning company. The application allows customers to book cleaning services online with date selection and location picking via Google Maps, while providing an admin panel for managing bookings and customer messages.

**Core Features:**
- Online booking with date availability (90-day window, excludes already booked dates)
- Interactive Google Maps location selection for service addresses
- Contact form for customer inquiries
- Admin panel for managing bookings and messages
- Multilingual support (Italian/English)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework:** Express.js (Node.js)
- **Entry Point:** `server.js` in root directory
- **Port:** 5000 (configurable via environment)

The server implements:
- RESTful API endpoints for bookings (`/api/book`), contacts, and admin functions
- Security middleware (CSP headers, XSS protection, HSTS)
- Input validation and sanitization for email, phone, and text fields
- Request body size limits (10kb) to prevent abuse

### Data Storage
- **Database:** PostgreSQL with connection pooling via `pg` library
- **Configuration:** Supports both `DATABASE_URL` (for Railway deployment) and individual connection parameters
- **Tables:** 
  - `bookings` - stores service bookings with location coordinates (lat/lng)
  - `messages` - stores contact form submissions
- **ID Generation:** UUIDs via `uuid` library
- **Schema:** Auto-created on server startup via `db.js` initialize function

### Frontend Architecture
- **Static Files:** Served from `Panorama/Panorama/` directory
- **Pages:** 
  - `index.html` - Homepage with booking form and company map
  - `services.html` - Service offerings display
  - `contact.html` - Contact form
  - `admin.html` - Admin dashboard for bookings
  - `messages.html` - Admin view for contact messages
- **Internationalization:** Client-side i18n via `translations.js` and `i18n.js`
- **Styling:** Single `styles.css` with CSS custom properties

### API Structure
- `POST /api/book` - Create new booking (requires name, email, phone, service, date, location coordinates)
- `GET /api/available-dates` - Fetch available booking dates
- Additional endpoints for admin operations (view/delete bookings and messages)

### Authentication
- Simple admin login (credentials hardcoded: admin/admin)
- Session managed client-side

## External Dependencies

### Third-Party Services
- **Google Maps API** - Used for displaying company location and interactive location picker for service addresses
  - Loaded via CDN script tag with async/defer
  - Used in booking form and admin panel for viewing client locations

### Database
- **PostgreSQL** - Primary data store
  - Connection via `pg` library with connection pooling
  - Supports Railway's `DATABASE_URL` format for cloud deployment

### Deployment Platform
- **Railway.app** - Configured deployment target
  - `railway.json` defines build and deploy configuration
  - Uses Nixpacks builder
  - Health check endpoint at `/_health`
  - Auto-deploy on GitHub push

### NPM Dependencies
- `express` - Web framework
- `pg` - PostgreSQL client
- `uuid` - UUID generation
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `dotenv` - Environment variable loading