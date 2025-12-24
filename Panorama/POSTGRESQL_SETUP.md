# PostgreSQL Setup Guide for Panorama Booking System

## Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Update .env file
Your `.env` file already has the PostgreSQL configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Panorama
DB_USER=postgres
DB_PASSWORD=dXrE48m_lK0n
PORT=5000
```

Make sure PostgreSQL is running with these credentials.

### 3. Create the Database (if not exists)
Connect to PostgreSQL as admin:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE "Panorama";
```

Exit psql:
```
\q
```

### 4. Run the Application
```bash
npm start
```

The application will automatically create the required tables:
- `bookings` - stores booking information
- `messages` - stores contact messages

## Database Schema

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Booking Endpoints
- `POST /api/book` - Create a new booking
- `GET /api/available-dates` - Get available booking dates
- `GET /api/admin/clients` - Get all bookings (admin)
- `DELETE /api/admin/clients/:id` - Delete a booking (admin)

### Message Endpoints
- `POST /api/contact` - Send a contact message
- `GET /api/admin/messages` - Get all messages (admin)
- `DELETE /api/admin/messages/:id` - Delete a message (admin)

## Data Persistence
All data is now stored in PostgreSQL database instead of JSON files. The JSON files in the `/data` folder are no longer used but are kept for historical reference.

## Troubleshooting

### Connection Error
If you get a connection error, check:
1. PostgreSQL is running
2. Database credentials in `.env` are correct
3. Database `Panorama` exists

### Table Already Exists Error
This is normal and expected - the application checks if tables exist before creating them.

## Environment Variables

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: panorama_db)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: password)
- `PORT` - Server port (default: 5000)
