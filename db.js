const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// PostgreSQL Connection Pool
// Support both Railway's DATABASE_URL and individual connection parameters
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'panorama_db'
      }
);

// Initialize database tables
async function initialize() {
  try {
    // Create bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY,
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
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

// ===== BOOKINGS =====
const bookings = {
  getAll: async () => {
    try {
      const result = await pool.query(
        'SELECT * FROM bookings ORDER BY date ASC'
      );
      return result.rows;
    } catch (err) {
      console.error('Error getting all bookings:', err);
      throw err;
    }
  },

  add: async (name, email, phone, service, date, locationLat, locationLng) => {
    try {
      const id = uuidv4();
      const result = await pool.query(
        `INSERT INTO bookings (id, name, email, phone, service, date, location_lat, location_lng)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [id, name, email, phone, service, date, locationLat, locationLng]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error adding booking:', err);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const result = await pool.query(
        'SELECT * FROM bookings WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error getting booking by id:', err);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        'DELETE FROM bookings WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw err;
    }
  },

  getBookedDates: async () => {
    try {
      const result = await pool.query(
        'SELECT DISTINCT date FROM bookings ORDER BY date ASC'
      );
      return result.rows.map(row => row.date);
    } catch (err) {
      console.error('Error getting booked dates:', err);
      throw err;
    }
  }
};

// ===== MESSAGES =====
const messages = {
  getAll: async () => {
    try {
      const result = await pool.query(
        'SELECT * FROM messages ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (err) {
      console.error('Error getting all messages:', err);
      throw err;
    }
  },

  add: async (name, email, phone, message) => {
    try {
      const id = uuidv4();
      const result = await pool.query(
        `INSERT INTO messages (id, name, email, phone, message)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, name, email, phone, message]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error adding message:', err);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const result = await pool.query(
        'SELECT * FROM messages WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error getting message by id:', err);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const result = await pool.query(
        'DELETE FROM messages WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error deleting message:', err);
      throw err;
    }
  }
};

// Initialize on load (non-blocking)
initialize().catch(err => {
  console.warn('Warning: Database initialization failed:', err.message);
  console.warn('Some features may not work until database is available.');
});

module.exports = { bookings, messages, pool };
