// Mobile Navigation Script
// Version 2.0

(function() {
  // Diese Variable verhindert, dass das Script mehrfach ausgeführt wird
  if (window.mobileNavInitialized === true) {
    return;
  }

  // Der DOM-Inhalt ist noch nicht vollständig geladen, also setzen wir einen Event Listener
  if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    // Der DOM-Inhalt ist bereits geladen, also können wir direkt initialisieren
    initMobileNav();
  }

  function initMobileNav() {
    // Markiere als initialisiert, um mehrfache Initialisierung zu verhindern
    window.mobileNavInitialized = true;
    
    // Selektiere die Elemente, die wir brauchen
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Wenn die Elemente nicht existieren, beende die Funktion
    if (!mobileMenuBtn || !navMenu) {
      return;
    }
    
    // Menü-Button Click-Handler
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle die Mobile-Menü-Klasse
      navMenu.classList.toggle('active');
      
      // Füge Sprachauswahl hinzu, falls sie noch nicht existiert
      if (navMenu.classList.contains('active') && !document.querySelector('.mobile-lang-section')) {
        const langSection = document.createElement('div');
        langSection.className = 'mobile-lang-section';
        langSection.innerHTML = `
          <div class="lang-title">Sprache</div>
          <div class="mobile-lang-options">
            <a href="?lang=de" class="mobile-lang-option active">Deutsch</a>
            <a href="?lang=en" class="mobile-lang-option">English</a>
          </div>
        `;
        navMenu.appendChild(langSection);
      }
    });
    
    // Dropdown-Handler für mobile Ansicht
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      // Nur nach toggle-subnav suchen
      const toggleLink = item.querySelector('.toggle-subnav');
      if (!toggleLink) return;
      
      const dropdown = item.querySelector('.program-dropdown');
      if (!dropdown) return;
      
      // Click-Handler für Subnavigation
      toggleLink.addEventListener('click', function(e) {
        // Nur auf Mobile-Geräten
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          e.stopPropagation();
          
          // Schließe andere offene Dropdowns
          document.querySelectorAll('.program-dropdown').forEach(other => {
            if (other !== dropdown && other.style.display === 'block') {
              other.style.display = 'none';
            }
          });
          
          // Toggle Dropdown display
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    });
  }
})(); 