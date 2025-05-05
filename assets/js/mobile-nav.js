// Mobile Navigation Script
// Version 2.2

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
    
    // Determine current language based on URL
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const pageIsEnglish = currentPage.includes('_en');
    
    // Menü-Button Click-Handler
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle die Mobile-Menü-Klasse
      navMenu.classList.toggle('active');
      
      // Füge Sprachauswahl hinzu, falls sie noch nicht existiert
      const existingLangSection = document.querySelector('.mobile-lang-section');
      
      if (navMenu.classList.contains('active')) {
        if (!existingLangSection) {
          const langSection = document.createElement('div');
          langSection.className = 'mobile-lang-section';
          langSection.innerHTML = `
            <div class="lang-title">${pageIsEnglish ? 'Language' : 'Sprache'}</div>
            <div class="mobile-lang-options">
              <a href="#" class="mobile-lang-option ${!pageIsEnglish ? 'active' : ''}" data-lang="de">Deutsch</a>
              <a href="#" class="mobile-lang-option ${pageIsEnglish ? 'active' : ''}" data-lang="en">English</a>
            </div>
          `;
          navMenu.appendChild(langSection);
          
          // Add event listeners to language options
          setupMobileLangButtons(langSection);
        } else {
          // Update existing language section visibility
          existingLangSection.style.display = 'block';
          
          // Refresh language options active state
          const deLangOption = existingLangSection.querySelector('[data-lang="de"]');
          const enLangOption = existingLangSection.querySelector('[data-lang="en"]');
          
          if (deLangOption && enLangOption) {
            deLangOption.classList.toggle('active', !pageIsEnglish);
            enLangOption.classList.toggle('active', pageIsEnglish);
          }
        }
      }
    });
    
    function setupMobileLangButtons(langSection) {
      const langOptions = langSection.querySelectorAll('.mobile-lang-option');
      langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
          e.preventDefault();
          const lang = this.getAttribute('data-lang');
          const currentPath = window.location.pathname;
          const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
          
          // Store language preference
          sessionStorage.setItem('preferredLanguage', lang);
          
          // Navigate to the appropriate language version
          if (lang === 'en' && !currentPage.includes('_en')) {
            // From German to English
            window.location.href = currentPage.replace('.html', '_en.html');
          } else if (lang === 'de' && currentPage.includes('_en')) {
            // From English to German
            window.location.href = currentPage.replace('_en.html', '.html');
          }
        });
      });
    }
    
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
            if (other !== dropdown && other.classList.contains('active')) {
              other.classList.remove('active');
            }
          });
          
          // Toggle Dropdown display
          dropdown.classList.toggle('active');
        }
      });
    });
    
    // Also initialize desktop language switching
    initializeDesktopLanguageSwitcher();
  }
  
  // Function to set up desktop language switcher
  function initializeDesktopLanguageSwitcher() {
    // Get language links in desktop view
    const deLinkDesktop = document.getElementById('lang-de-link');
    const enLinkDesktop = document.getElementById('lang-en-link');
    
    if (!deLinkDesktop || !enLinkDesktop) return;
    
    // Determine current language
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const isEnglish = currentPage.includes('_en');
    
    // Set appropriate active classes
    deLinkDesktop.classList.toggle('active', !isEnglish);
    enLinkDesktop.classList.toggle('active', isEnglish);
    
    // Set up click handlers
    if (isEnglish) {
      // We're on English page, set up German link
      const germanPage = currentPage.replace('_en.html', '.html');
      deLinkDesktop.setAttribute('href', germanPage);
      deLinkDesktop.addEventListener('click', function() {
        sessionStorage.setItem('preferredLanguage', 'de');
      });
      
      // Disable English link
      enLinkDesktop.setAttribute('href', '#');
    } else {
      // We're on German page, set up English link
      const englishPage = currentPage.replace('.html', '_en.html');
      enLinkDesktop.setAttribute('href', englishPage);
      enLinkDesktop.addEventListener('click', function() {
        sessionStorage.setItem('preferredLanguage', 'en');
      });
      
      // Disable German link
      deLinkDesktop.setAttribute('href', '#');
    }
  }
})(); 