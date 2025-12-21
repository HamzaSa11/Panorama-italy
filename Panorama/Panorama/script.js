// Secret admin reveal - press 'A' three times quickly
let adminKeyPresses = [];
const ADMIN_KEY_CODE = 'a';
const ADMIN_KEY_TIMEOUT = 1000; // 1 second between presses
const ADMIN_PRESSES_NEEDED = 3;

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === ADMIN_KEY_CODE) {
    const now = Date.now();
    
    // Clear old presses if timeout exceeded
    adminKeyPresses = adminKeyPresses.filter(time => now - time < ADMIN_KEY_TIMEOUT);
    adminKeyPresses.push(now);
    
    // Check if admin revealed
    if (adminKeyPresses.length >= ADMIN_PRESSES_NEEDED) {
      const adminLink = document.getElementById('adminLink');
      if (adminLink) {
        adminLink.style.display = 'block';
        adminLink.style.animation = 'fadeIn 0.3s ease-in';
        adminKeyPresses = [];
      }
    }
  }
});

const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('show');
  });
});

async function loadAvailableDates() {
  try {
    const response = await fetch('/api/available-dates');
    const data = await response.json();
    const dateSelect = document.getElementById('date');
    if (!dateSelect) return;
    dateSelect.innerHTML = '';

    data.available.forEach(date => {
      const option = document.createElement('option');
      option.value = date;
      const dateObj = new Date(date + 'T00:00:00Z');
      option.textContent = dateObj.toLocaleDateString('it-IT', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      dateSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Errore nel caricamento date:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    loadAvailableDates();
    
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const locationLat = document.getElementById('locationLat').value;
      const locationLng = document.getElementById('locationLng').value;
      
      if (!locationLat || !locationLng) {
        const messageEl = document.getElementById('formMessage');
        messageEl.textContent = '✗ Per favore, seleziona una posizione sulla mappa';
        messageEl.style.color = 'red';
        return;
      }
      
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        date: document.getElementById('date').value,
        locationLat: parseFloat(locationLat),
        locationLng: parseFloat(locationLng)
      };

      try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        const messageEl = document.getElementById('formMessage');

        if (response.ok) {
          messageEl.textContent = '✓ Prenotazione completata! Ti contatteremo presto.';
          messageEl.style.color = 'green';
          bookingForm.reset();
          document.getElementById('locationDisplay').textContent = 'Nessuna posizione selezionata';
          document.getElementById('locationDisplay').style.color = '#666';
          loadAvailableDates();
        } else {
          messageEl.textContent = '✗ ' + result.error;
          messageEl.style.color = 'red';
        }
      } catch (err) {
        const messageEl = document.getElementById('formMessage');
        if (messageEl) {
          messageEl.textContent = '✗ Errore di connessione';
          messageEl.style.color = 'red';
        }
      }
    });
  }
});
