/**
 * Language Switch Functionality for StGallen imt Website
 * This script provides centralized language switching functionality
 * that works consistently across all pages of the website.
 */

(function() {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitching);
  } else {
    // DOM already loaded
    initLanguageSwitching();
  }

  function initLanguageSwitching() {
    console.log("Language switch initialization");
    
    // First cleanup any existing handlers
    cleanupExistingHandlers();
    
    // Then initialize new handlers
    setupLanguageSwitchHandlers();
    
    // Mark active language in UI
    updateActiveLanguageUI();
    
    // Make initLanguageSwitching globally accessible for direct calls
    window.initLanguageSwitching = initLanguageSwitching;
  }
  
  // Clean up any existing handlers to prevent duplicates
  function cleanupExistingHandlers() {
    // Get all language links in both desktop and mobile views
    document.querySelectorAll('[data-lang], .mobile-lang-option, .only-mobile-lang-option').forEach(link => {
      link.removeAttribute('onclick');
      
      // Clone and replace to remove all event listeners
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    });
  }
  
  // Setup handlers for language switching
  function setupLanguageSwitchHandlers() {
    // Desktop language switcher
    const deLinkDesktop = document.getElementById('lang-de-link');
    const enLinkDesktop = document.getElementById('lang-en-link');
    
    if (deLinkDesktop) {
      deLinkDesktop.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLanguage('de');
        return false;
      });
    }
    
    if (enLinkDesktop) {
      enLinkDesktop.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLanguage('en');
        return false;
      });
    }
    
    // Mobile language switcher - supports both class naming conventions
    document.querySelectorAll('.only-mobile-lang-option, .mobile-lang-option').forEach(link => {
      // Extract language from data-lang attribute or href
      let lang;
      if (link.getAttribute('data-lang')) {
        lang = link.getAttribute('data-lang');
      } else if (link.href && link.href.includes('lang=')) {
        // Extract from URL parameter
        const langParam = link.href.split('lang=')[1];
        if (langParam) {
          lang = langParam.split('&')[0]; // Get the language value
        }
      } else if (link.classList.contains('mobile-lang-option')) {
        // Extract from class if it has language indication
        if (link.textContent.trim().toLowerCase() === 'deutsch') {
          lang = 'de';
        } else if (link.textContent.trim().toLowerCase() === 'english') {
          lang = 'en';
        }
      }
      
      if (lang) {
        // Ensure the link has data-lang attribute for future reference
        if (!link.getAttribute('data-lang')) {
          link.setAttribute('data-lang', lang);
        }
        
        link.addEventListener('click', function(e) {
          e.preventDefault();
          switchToLanguage(lang);
          return false;
        });
      }
    });
    
    // Set up global function for direct use in HTML
    window.switchLanguage = function(lang, event) {
      if (event) {
        event.preventDefault();
      }
      switchToLanguage(lang);
      return false;
    };
  }
  
  // Core language switching function
  function switchToLanguage(lang) {
    // Get current page
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const isEnglish = currentPage.includes('_en');
    
    console.log("Switching to language:", lang, "Current page:", currentPage, "Is English:", isEnglish);
    
    // Prevent unnecessary navigation
    if ((lang === 'en' && isEnglish) || (lang === 'de' && !isEnglish)) {
      console.log("Already on requested language page");
      return;
    }
    
    // Store language preference
    sessionStorage.setItem('preferredLanguage', lang);
    
    // Create a loading indicator
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    
    const spinner = document.createElement('div');
    spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
    spinner.style.borderLeft = '4px solid #3498db';
    spinner.style.borderRadius = '50%';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.animation = 'spin 1s linear infinite';
    
    const keyframes = document.createElement('style');
    keyframes.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(keyframes);
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
    
    // Navigate to corresponding language version
    if (lang === 'en' && !isEnglish) {
      // From German to English
      window.location.href = currentPage.replace('.html', '_en.html');
    } else if (lang === 'de' && isEnglish) {
      // From English to German
      window.location.href = currentPage.replace('_en.html', '.html');
    }
  }
  
  // Update UI to mark active language
  function updateActiveLanguageUI() {
    // Get current page info
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const isEnglish = currentPage.includes('_en');
    
    // Desktop language selection
    const deLinkDesktop = document.getElementById('lang-de-link');
    const enLinkDesktop = document.getElementById('lang-en-link');
    
    if (deLinkDesktop && enLinkDesktop) {
      // First remove active class from both
      deLinkDesktop.classList.remove('active');
      enLinkDesktop.classList.remove('active');
      
      // Add active class to current language
      if (isEnglish) {
        enLinkDesktop.classList.add('active');
      } else {
        deLinkDesktop.classList.add('active');
      }
    }
    
    // Mobile language selection - supports both class naming conventions
    const mobileLanguageOptions = document.querySelectorAll('.only-mobile-lang-option, .mobile-lang-option');
    
    mobileLanguageOptions.forEach(link => {
      // Get language from data-lang attribute or determine from context
      let lang = link.getAttribute('data-lang');
      
      if (!lang) {
        // Try to determine language from content or class
        if (link.textContent.trim().toLowerCase() === 'deutsch') {
          lang = 'de';
        } else if (link.textContent.trim().toLowerCase() === 'english') {
          lang = 'en';
        }
      }
      
      // First remove all active classes
      link.classList.remove('active');
      
      // Mark current language
      if ((lang === 'en' && isEnglish) || (lang === 'de' && !isEnglish)) {
        link.classList.add('active');
      }
    });
    
    // Hide duplicate language sections on program pages
    const shouldHideDuplicates = document.querySelectorAll('.only-mobile-lang-section, .mobile-lang-section').length > 1;
    
    if (shouldHideDuplicates) {
      // If both types of sections exist, prioritize the one with only-mobile-lang-section
      const onlyMobileSection = document.querySelector('.only-mobile-lang-section');
      if (onlyMobileSection) {
        // Hide any mobile-lang-section that is not also an only-mobile-lang-section
        document.querySelectorAll('.mobile-lang-section:not(.only-mobile-lang-section)').forEach(section => {
          section.style.display = 'none';
        });
      }
    }
  }
  
  // Observer for dynamic navigation loading
  function setupMutationObserver() {
    // Create an observer instance
    const observer = new MutationObserver(function(mutations) {
      let shouldReinitialize = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && 
            (mutation.target.id === 'navigation-container' || 
             mutation.target.classList.contains('nav-menu') ||
             mutation.target.classList.contains('only-mobile-lang-section') ||
             mutation.target.classList.contains('mobile-lang-section'))) {
          shouldReinitialize = true;
        }
      });
      
      if (shouldReinitialize) {
        // Throttle reinitialization to prevent multiple redundant calls
        if (!window.languageSwitchReinitTimeout) {
          window.languageSwitchReinitTimeout = setTimeout(() => {
            console.log("Navigation change detected, re-initializing language switch");
            initLanguageSwitching();
            window.languageSwitchReinitTimeout = null;
          }, 100);
        }
      }
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { 
      childList: true,
      subtree: true
    });
  }
  
  // Listen for custom events from mobile-nav.js
  window.addEventListener('navigationOpened', function() {
    console.log("Navigation opened event received");
    // Throttle to prevent multiple calls
    if (!window.languageSwitchNavTimeout) {
      window.languageSwitchNavTimeout = setTimeout(() => {
        initLanguageSwitching();
        window.languageSwitchNavTimeout = null;
      }, 50);
    }
  });
  
  window.addEventListener('navigationUpdated', function() {
    console.log("Navigation updated event received");
    // Throttle to prevent multiple calls
    if (!window.languageSwitchUpdateTimeout) {
      window.languageSwitchUpdateTimeout = setTimeout(() => {
        initLanguageSwitching();
        window.languageSwitchUpdateTimeout = null;
      }, 50);
    }
  });
  
  // Set up the observer for dynamic content loading
  setupMutationObserver();
})(); 