# PANORAMA Cleaning Services Website

## Overview
Complete booking and contact management system for PANORAMA, a Bolzano-based cleaning company. Features include online booking with date availability, contact form submissions, admin panel for managing clients and messages, location selection via Google Maps, and multilingual support.

## Current Technology Stack
- **Backend:** Node.js + Express with security features
- **Storage:** File-based (JSON files in `data/` directory)
- **Frontend:** HTML5, CSS3, JavaScript with i18n support
- **Maps:** Google Maps integration for location selection
- **Languages:** Italian (it), English (en)
- **Port:** 5000

## Key Features
✅ Booking form with date availability tracking (90 days, excludes booked dates)  
✅ Location selection via interactive Google Maps  
✅ Contact form for customer messages  
✅ Admin panel with login (credentials: admin/admin)  
✅ Manage clients - view, delete bookings, see service locations  
✅ Manage messages - view and delete contact submissions  
✅ **NEW: Multilingual support** - Switch between Italian and English  
✅ **NEW: Security features** - Rate limiting, secure headers, input sanitization  
✅ Google Maps showing company location (Via C. Augusta 32/2, Bolzano)  
✅ Clickable logo navigation on all pages  
✅ Sticky footer with creator credits  

## Architecture

### Backend (server.js)
- Express server on port 5000
- File-based data persistence using `db.js`
- REST API endpoints for booking, contacts, and admin functions
- **Security features:**
  - Rate limiting (100 requests per 15 minutes per IP)
  - Secure HTTP headers (CSP, X-Frame-Options, etc.)
  - Input sanitization to prevent XSS
  - Payload size limits (10kb)

### Data Storage (db.js)
- `bookings.json` - stores all service bookings with location coordinates
- `messages.json` - stores all contact form submissions
- Automatic file initialization on server start
- IDs generated using timestamps + random strings

### Frontend Structure
- `index.html` - Home page with Google Maps
- `services.html` - Service offerings
- `contact.html` - Contact form
- `admin.html` - Admin login and client management with map viewer
- `messages.html` - View contact submissions
- `styles.css` - Global styling with language switcher styles
- `script.js` - Client-side validation and interactions
- `translations.js` - All text translations (Italian & English)
- `i18n.js` - Language switching functionality

## Recent Changes
- **Latest:** Added multilingual support (Italian/English) and security features
  - Language switcher in navigation bar
  - Stores language preference in localStorage
  - Security: Rate limiting, secure headers, input sanitization
  - All text content translatable via data-translate attributes

## Admin Credentials
- **Username:** admin
- **Password:** admin

## Creator Credits
- Saoudi Hamza: https://www.facebook.com/share/1AfEMB7vru/
- Zairi Chams Eddin: https://www.facebook.com/share/1SLD8pG56v/

## Location
Via C. Augusta 32/2 – 39100 Bolzano

## Running Locally

### Simple Startup
```bash
npm install
npm start
```

The server will start on http://localhost:5000 with all data stored in JSON files.

## Security Features Implemented
- **Rate Limiting:** 100 requests per IP per 15 minutes
- **Secure Headers:** X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP, HSTS
- **Input Sanitization:** Removes <> characters to prevent XSS attacks
- **Payload Limits:** Max 10kb per request to prevent buffer overflow
- **Email & Phone Validation:** Format verification on all form submissions

## Language Support
- **Current Languages:** Italian (it), English (en)
- **Switching:** Click IT/EN buttons in the navigation bar
- **Persistence:** Language preference saved in localStorage
- **How to Add Languages:** Add new language object to `translations.js` and add new button to nav

## File Structure
```
panorama-booking/
├── server.js              # Express server with security
├── db.js                  # File-based data storage
├── package.json
├── replit.md              # This file
├── Chams project/         # Frontend files
│   ├── index.html
│   ├── services.html
│   ├── contact.html
│   ├── admin.html
│   ├── messages.html
│   ├── styles.css
│   ├── script.js
│   ├── translations.js    # Text translations
│   └── i18n.js           # Language switching
└── data/                  # Auto-created on first run
    ├── bookings.json
    └── messages.json
```

## API Endpoints
- `POST /api/book` - Create a booking (requires location)
- `GET /api/available-dates` - Get available booking dates
- `POST /api/contact` - Submit contact message
- `POST /api/admin-login` - Admin login
- `GET /api/admin/clients` - Get all bookings
- `DELETE /api/admin/clients/:id` - Delete booking
- `GET /api/admin/messages` - Get all messages
- `DELETE /api/admin/messages/:id` - Delete message

## User Preferences
- File-based storage for easy local development
- No external database required
- Multilingual interface (expandable)
- Security-conscious implementation with rate limiting and input validation
