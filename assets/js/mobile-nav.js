// Mobile Navigation Initialisierer
// Diese Datei muss auf jeder Seite NACH dem Laden der Navigation geladen werden

console.log('mobile-nav.js wurde geladen!');

// Funktion zum Initialisieren der mobilen Navigation
function initMobileNavigation() {
  console.log('Mobile Navigation wird initialisiert...');
  
  // Mobile Menu Button finden
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!mobileMenuBtn) {
    console.error('Mobile Menu Button nicht gefunden!');
  }
  
  if (!navMenu) {
    console.error('Nav Menu nicht gefunden!');
  }
  
  if (!mobileMenuBtn || !navMenu) {
    console.error('Mobile Menu Elemente nicht gefunden - HTML Struktur prüfen!');
    console.log('HTML Navigation Container:', document.getElementById('navigation-container').innerHTML);
    return;
  }
  
  console.log('Mobile Menu Button gefunden, initialisiere Event-Handler...');
  
  // Event-Handler für den Mobile-Menü-Button
  mobileMenuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Mobile Menu Button geklickt!');
    
    // Toggle mobile menu
    navMenu.classList.toggle('active');
    console.log('Nav Menu Active Status:', navMenu.classList.contains('active'));
    
    // Sprachauswahl hinzufügen
    if (navMenu.classList.contains('active') && !document.querySelector('.mobile-lang-section')) {
      const mobileLangSection = document.createElement('div');
      mobileLangSection.className = 'mobile-lang-section';
      mobileLangSection.innerHTML = `
        <div class="lang-title">Sprache</div>
        <div class="mobile-lang-options">
          <a href="?lang=de" class="mobile-lang-option active">Deutsch</a>
          <a href="?lang=en" class="mobile-lang-option">English</a>
        </div>
      `;
      navMenu.appendChild(mobileLangSection);
    }
  });
  
  // Dropdown-Funktionalität für mobile Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.program-dropdown');
    
    if (link && dropdown) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          
          // Alle anderen Dropdowns schließen
          document.querySelectorAll('.program-dropdown').forEach(otherDropdown => {
            if (otherDropdown !== dropdown && otherDropdown.style.display === 'block') {
              otherDropdown.style.display = 'none';
            }
          });
          
          // Aktuelles Dropdown umschalten
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    }
  });
  
  console.log('Mobile Navigation erfolgreich initialisiert!');
}

// Funktion zum wiederholten Versuch der Initialisierung
function tryInitMobileNav() {
  if (document.querySelector('.mobile-menu-btn') && document.querySelector('.nav-menu')) {
    console.log('Navigation-Elemente gefunden, initialisiere jetzt...');
    initMobileNavigation();
    return true;
  }
  return false;
}

// Sofort versuchen zu initialisieren
if (!tryInitMobileNav()) {
  console.log('Navigation noch nicht geladen, warte auf DOMContentLoaded...');
  
  // Versuche es erneut, wenn das DOM geladen ist
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded ausgelöst, versuche erneut...');
    if (!tryInitMobileNav()) {
      // Wenn es immer noch nicht funktioniert, versuche es regelmäßig
      console.log('Immer noch keine Navigation-Elemente gefunden, starte Interval...');
      let attempts = 0;
      const navInterval = setInterval(function() {
        attempts++;
        if (tryInitMobileNav() || attempts >= 30) { // Maximal 3 Sekunden (30 * 100ms) versuchen
          clearInterval(navInterval);
          console.log('Navigation-Initialisierung abgeschlossen oder maximale Anzahl von Versuchen erreicht.');
        }
      }, 100);
    }
  });
} 