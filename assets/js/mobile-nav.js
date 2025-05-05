// Mobile Navigation Script
// Version 4.0 - Komplett vereinfachter Ansatz

(function() {
  // Sofortige Ausführung nach dem Laden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    // DOM bereits geladen
    initMobileNav();
  }

  function initMobileNav() {
    console.log("Mobile Nav v4.0 init");
    
    // Grundlegende Elemente finden
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    // Einfacher Check ob die nötigen Elemente existieren
    if (!mobileMenuBtn || !navMenu) {
      console.error("Mobile menu elements not found");
      return;
    }
    
    console.log("Mobile menu elements found:", mobileMenuBtn, navMenu);
    
    // Aktuelle Sprache ermitteln
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const pageIsEnglish = currentPage.includes('_en');
    
    // EINFACHER ANSATZ: Direkter Event-Listener auf dem Button
    mobileMenuBtn.onclick = function(e) {
      console.log("Mobile menu button clicked");
      e.preventDefault();
      
      // Einfaches Toggle der Sichtbarkeit via Klassenwechsel
      navMenu.classList.toggle('active');
      console.log("Menu toggle:", navMenu.classList.contains('active'));
      
      if (navMenu.classList.contains('active')) {
        // Wenn Menü offen ist, stelle Sprachauswahl sicher
        ensureLanguageSection();
      }
    };
    
    // Stelle Sprachauswahl-Sektion sicher
    function ensureLanguageSection() {
      if (!document.querySelector('.mobile-lang-section')) {
        console.log("Creating language section");
        
        // Container erstellen
        const langSection = document.createElement('div');
        langSection.className = 'mobile-lang-section';
        langSection.style.margin = '15px 0 0 0';
        langSection.style.padding = '15px';
        langSection.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
        
        // Titel
        const langTitle = document.createElement('div');
        langTitle.textContent = pageIsEnglish ? 'Language' : 'Sprache';
        langTitle.style.fontSize = '0.85rem';
        langTitle.style.textTransform = 'uppercase';
        langTitle.style.marginBottom = '10px';
        langTitle.style.color = 'rgba(255, 255, 255, 0.7)';
        
        // Optionen-Container
        const langOptions = document.createElement('div');
        langOptions.style.display = 'flex';
        langOptions.style.gap = '15px';
        
        // Deutsch-Option
        const deOption = document.createElement('a');
        deOption.href = '#';
        deOption.textContent = 'Deutsch';
        deOption.style.color = 'white';
        deOption.style.textDecoration = 'none';
        if (!pageIsEnglish) {
          deOption.style.fontWeight = 'bold';
          deOption.style.opacity = '1';
        } else {
          deOption.style.opacity = '0.7';
        }
        deOption.onclick = function(e) {
          e.preventDefault();
          switchToGerman();
          return false;
        };
        
        // English-Option
        const enOption = document.createElement('a');
        enOption.href = '#';
        enOption.textContent = 'English';
        enOption.style.color = 'white';
        enOption.style.textDecoration = 'none';
        if (pageIsEnglish) {
          enOption.style.fontWeight = 'bold';
          enOption.style.opacity = '1';
        } else {
          enOption.style.opacity = '0.7';
        }
        enOption.onclick = function(e) {
          e.preventDefault();
          switchToEnglish();
          return false;
        };
        
        // Zusammenfügen
        langOptions.appendChild(deOption);
        langOptions.appendChild(enOption);
        langSection.appendChild(langTitle);
        langSection.appendChild(langOptions);
        navMenu.appendChild(langSection);
      }
    }
    
    // Einfache Sprach-Wechsel-Funktion
    function switchToEnglish() {
      if (!pageIsEnglish) {
        window.location.href = currentPage.replace('.html', '_en.html');
      }
    }
    
    function switchToGerman() {
      if (pageIsEnglish) {
        window.location.href = currentPage.replace('_en.html', '.html');
      }
    }
    
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
    
    // Desktop-Sprachschalter
    const deLinkDesktop = document.getElementById('lang-de-link');
    const enLinkDesktop = document.getElementById('lang-en-link');
    
    if (deLinkDesktop && enLinkDesktop) {
      // Setze aktiven Status
      if (pageIsEnglish) {
        enLinkDesktop.classList.add('active');
        deLinkDesktop.onclick = function(e) {
          e.preventDefault();
          switchToGerman();
          return false;
        };
      } else {
        deLinkDesktop.classList.add('active');
        enLinkDesktop.onclick = function(e) {
          e.preventDefault();
          switchToEnglish();
          return false;
        };
      }
    }
    
    console.log("Mobile Nav init complete");
  }
})(); 