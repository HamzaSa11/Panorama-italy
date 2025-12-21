const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Initialize data directory and files
function initialize() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]), 'utf-8');
  }

  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]), 'utf-8');
  }
}

// Read data from file
function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    return [];
  }
}

// Write data to file
function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Generate unique ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// ===== BOOKINGS =====
const bookings = {
  getAll: () => {
    return readFile(BOOKINGS_FILE);
  },

  add: (name, email, phone, service, date, locationLat, locationLng) => {
    const all = readFile(BOOKINGS_FILE);
    const newBooking = {
      id: generateId(),
      name,
      email,
      phone,
      service,
      date,
      locationLat,
      locationLng,
      created_at: new Date().toISOString()
    };
    all.push(newBooking);
    writeFile(BOOKINGS_FILE, all);
    return newBooking;
  },

  getById: (id) => {
    const all = readFile(BOOKINGS_FILE);
    return all.find(b => String(b.id) === String(id));
  },

  delete: (id) => {
    const all = readFile(BOOKINGS_FILE);
    const index = all.findIndex(b => String(b.id) === String(id));
    if (index === -1) return null;
    const deleted = all[index];
    all.splice(index, 1);
    writeFile(BOOKINGS_FILE, all);
    return deleted;
  },

  getBookedDates: () => {
    const all = readFile(BOOKINGS_FILE);
    return all.map(b => b.date);
  }
};

// ===== MESSAGES =====
const messages = {
  getAll: () => {
    const all = readFile(MESSAGES_FILE);
    return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  add: (name, email, phone, message) => {
    const all = readFile(MESSAGES_FILE);
    const newMessage = {
      id: generateId(),
      name,
      email,
      phone,
      message,
      created_at: new Date().toISOString()
    };
    all.push(newMessage);
    writeFile(MESSAGES_FILE, all);
    return newMessage;
  },

  getById: (id) => {
    const all = readFile(MESSAGES_FILE);
    return all.find(m => String(m.id) === String(id));
  },

  delete: (id) => {
    const all = readFile(MESSAGES_FILE);
    const index = all.findIndex(m => String(m.id) === String(id));
    if (index === -1) return null;
    const deleted = all[index];
    all.splice(index, 1);
    writeFile(MESSAGES_FILE, all);
    return deleted;
  }
};

// Initialize on load
initialize();

module.exports = { bookings, messages };
