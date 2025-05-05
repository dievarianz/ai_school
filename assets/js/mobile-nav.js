// Mobile Navigation Script
// Version 5.0 - Vereinfacht und kompatibel mit language-switch.js

(function() {
  // Sofortige Ausführung nach dem Laden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    // DOM bereits geladen
    initMobileNav();
  }

  function initMobileNav() {
    console.log("Mobile Nav v5.0 init");
    
    // Grundlegende Elemente finden
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Einfacher Check ob die nötigen Elemente existieren
    if (!mobileMenuBtn || !navMenu) {
      console.error("Mobile menu elements not found");
      return;
    }
    
    console.log("Mobile menu elements found:", mobileMenuBtn, navMenu);
    
    // EINFACHER ANSATZ: Direkter Event-Listener auf dem Button
    mobileMenuBtn.onclick = function(e) {
      console.log("Mobile menu button clicked");
      e.preventDefault();
      
      // Einfaches Toggle der Sichtbarkeit via Klassenwechsel
      navMenu.classList.toggle('active');
      console.log("Menu toggle:", navMenu.classList.contains('active'));
      
      if (navMenu.classList.contains('active')) {
        // Sprachsektion überprüfen
        ensureLanguageSection();
        
        // Notify language-switch.js that navigation is open
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('navigationOpened'));
        }
      }
    };
    
    // Stelle Sprachauswahl-Sektion sicher
    function ensureLanguageSection() {
      if (!document.querySelector('.only-mobile-lang-section')) {
        console.log("Creating language section");
        
        // Aktuelle Sprache ermitteln
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        const pageIsEnglish = currentPage.includes('_en');
        
        // Container erstellen
        const langSection = document.createElement('div');
        langSection.className = 'only-mobile-lang-section';
        langSection.style.margin = '15px 0 0 0';
        langSection.style.padding = '15px';
        langSection.style.borderTop = '1px solid rgba(0, 0, 0, 0.1)';
        
        // Titel
        const langTitle = document.createElement('div');
        langTitle.textContent = pageIsEnglish ? 'Language' : 'Sprache';
        langTitle.className = 'only-mobile-lang-title';
        langTitle.style.fontSize = '0.85rem';
        langTitle.style.marginBottom = '10px';
        langTitle.style.color = 'var(--color-muted)';
        
        // Optionen-Container
        const langOptions = document.createElement('div');
        langOptions.className = 'only-mobile-lang-options';
        langOptions.style.display = 'flex';
        langOptions.style.gap = '15px';
        
        // Deutsch-Option
        const deOption = document.createElement('a');
        deOption.href = '#';
        deOption.textContent = 'Deutsch';
        deOption.className = 'only-mobile-lang-option';
        deOption.setAttribute('data-lang', 'de');
        if (!pageIsEnglish) {
          deOption.classList.add('active');
        }
        
        // English-Option
        const enOption = document.createElement('a');
        enOption.href = '#';
        enOption.textContent = 'English';
        enOption.className = 'only-mobile-lang-option';
        enOption.setAttribute('data-lang', 'en');
        if (pageIsEnglish) {
          enOption.classList.add('active');
        }
        
        // Zusammenfügen
        langOptions.appendChild(deOption);
        langOptions.appendChild(enOption);
        langSection.appendChild(langTitle);
        langSection.appendChild(langOptions);
        navMenu.appendChild(langSection);
        
        // Wenn language-switch.js geladen ist, lassen wir es die Event-Handler setzen
        setTimeout(() => {
          if (window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('navigationUpdated'));
          }
        }, 100);
      }
    }
    
    // Entferne beliebige Sprache-Elemente außerhalb der Navigation
    function removeOutsideLanguageElements() {
      // Alle sichtbaren Elemente mit Sprache finden
      document.querySelectorAll('body > div').forEach(div => {
        if (div.textContent && 
            (div.textContent.includes('Sprache') || div.textContent.includes('Language')) && 
            !div.id.includes('navigation') && 
            !div.id.includes('sidebar') && 
            !div.id.includes('footer') &&
            !div.classList.contains('only-mobile-lang-section')) {
          div.style.display = 'none';
          console.log('Hidden unwanted language element');
        }
      });
    }
    
    // Sprachelemente entfernen
    removeOutsideLanguageElements();
    // Nochmal nach verzögerter Zeit ausführen
    setTimeout(removeOutsideLanguageElements, 500);
    
    // VEREINFACHTER DROPDOWN-MENU-HANDLER
    setTimeout(function() {
      const dropdownToggles = document.querySelectorAll('.toggle-subnav');
      
      dropdownToggles.forEach(function(toggle) {
        const dropdownParent = toggle.closest('.nav-item');
        const dropdown = dropdownParent ? dropdownParent.querySelector('.program-dropdown') : null;
        
        if (!dropdown) return;
        
        toggle.onclick = function(e) {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            
            // Schließe andere Dropdowns
            document.querySelectorAll('.program-dropdown').forEach(function(other) {
              if (other !== dropdown) {
                other.style.display = 'none';
              }
            });
            
            // Toggle aktuelles Dropdown
            if (dropdown.style.display === 'block') {
              dropdown.style.display = 'none';
            } else {
              dropdown.style.display = 'block';
              dropdown.style.background = 'rgba(255, 255, 255, 0.95)';
              dropdown.style.padding = '15px';
              dropdown.style.borderRadius = '8px';
              
              // Mobil-Styling
              const menuColumns = dropdown.querySelectorAll('.menu-column');
              menuColumns.forEach(function(col) {
                col.style.width = '100%';
                col.style.padding = '0';
                col.style.marginBottom = '10px';
              });
            }
          }
        };
      });
    }, 300);
    
    console.log("Mobile Nav init complete");
  }
})(); 