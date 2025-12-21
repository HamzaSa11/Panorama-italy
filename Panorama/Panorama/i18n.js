let currentLanguage = localStorage.getItem('language') || 'it';

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  updatePageLanguage();
}

function getLanguage() {
  return currentLanguage;
}

function t(key) {
  return translations[currentLanguage]?.[key] || translations.it?.[key] || key;
}

function updatePageLanguage() {
  // Update navigation
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    el.textContent = t(key);
  });

  // Update placeholders
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    el.placeholder = t(key);
  });

  // Update titles
  document.querySelectorAll('[data-translate-title]').forEach(el => {
    const key = el.getAttribute('data-translate-title');
    el.title = t(key);
  });

  // Update selected options text
  document.querySelectorAll('select[data-translate-options]').forEach(select => {
    select.querySelectorAll('option').forEach(option => {
      const key = option.getAttribute('data-key');
      if (key) option.textContent = t(key);
    });
  });

  // Re-load dates if booking form exists
  if (document.getElementById('bookingForm')) {
    setTimeout(() => loadAvailableDates(), 100);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  updatePageLanguage();
});
