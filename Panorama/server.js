const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { bookings, messages } = require('./db');

const app = express();

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self' https://maps.googleapis.com https://maps.gstatic.com; script-src 'self' 'unsafe-inline' https://maps.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:");
  next();
});

// Rate Limiting (simple memory-based)
const rateLimitStore = {};
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
  } else if (now > rateLimitStore[ip].resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
  } else {
    rateLimitStore[ip].count++;
  }
  
  if (rateLimitStore[ip].count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
  
  next();
}

app.use(rateLimit);
app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('Chams project'));

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return /^[0-9\s\-\+\(\)]{8,}$/.test(phone);
};

// Sanitize input
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
}

app.post('/api/book', (req, res) => {
  const { name, email, phone, service, date, locationLat, locationLng } = req.body;

  if (!name || !email || !phone || !service || !date || locationLat === undefined || locationLng === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: 'Invalid phone format' });
  }

  try {
    const booking = bookings.add(
      sanitize(name),
      sanitize(email),
      sanitize(phone),
      sanitize(service),
      date,
      parseFloat(locationLat),
      parseFloat(locationLng)
    );
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

app.get('/api/available-dates', (req, res) => {
  try {
    const bookedDates = bookings.getBookedDates();
    
    const available = [];
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      if (!bookedDates.includes(dateStr)) {
        available.push(dateStr);
      }
    }
    
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching available dates' });
  }
});

app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/admin/clients', (req, res) => {
  try {
    const allBookings = bookings.getAll();
    const sorted = allBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json({ clients: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

app.delete('/api/admin/clients/:id', (req, res) => {
  const { id } = req.params;
  try {
    const deleted = bookings.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting client' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: 'Invalid phone format' });
  }

  try {
    const msg = messages.add(
      sanitize(name),
      sanitize(email),
      sanitize(phone),
      sanitize(message)
    );
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ error: 'Error creating message' });
  }
});

app.get('/api/admin/messages', (req, res) => {
  try {
    const allMessages = messages.getAll();
    res.json({ messages: allMessages });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.delete('/api/admin/messages/:id', (req, res) => {
  const { id } = req.params;
  try {
    const deleted = messages.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting message' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
