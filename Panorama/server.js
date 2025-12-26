const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { bookings, messages } = require('./db');
require('dotenv').config();

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

app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('Panorama'));

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9\s\-\+\(\)]{8,}$/.test(phone);
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '');
}

// Create booking
app.post('/api/book', async (req, res) => {
  const { name, email, phone, service, date, locationLat, locationLng } = req.body;

  if (!name || !email || !phone || !service || !date || locationLat === undefined || locationLng === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Invalid phone format' });

  try {
    const booking = await bookings.add(
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

// Get available dates
app.get('/api/available-dates', async (req, res) => {
  try {
    const bookedDates = await bookings.getBookedDates();
    const available = [];
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      if (!bookedDates.includes(dateStr)) available.push(dateStr);
    }
    res.json({ available });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching available dates' });
  }
});

// Admin login
app.post('/api/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '6e75dTdLU6kXK1xNp6j5') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get all bookings
app.get('/api/admin/clients', async (req, res) => {
  try {
    const allBookings = await bookings.getAll();
    const sorted = allBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json({ clients: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching clients' });
  }
});

// Delete a booking
app.delete('/api/admin/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await bookings.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting client' });
  }
});

// Add message
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (!validatePhone(phone)) return res.status(400).json({ error: 'Invalid phone format' });

  try {
    const msg = await messages.add(
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

// Get all messages
app.get('/api/admin/messages', async (req, res) => {
  try {
    const allMessages = await messages.getAll();
    res.json({ messages: allMessages });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Delete a message
app.delete('/api/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await messages.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting message' });
  }
});

// Lightweight health endpoint for platform healthchecks
app.get('/_health', (req, res) => res.sendStatus(200));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
