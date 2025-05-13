/**
 * Language Switch Functionality for StGallen imt Website
 * This script provides centralized language switching functionality
 * that works consistently across all pages of the website.
 */

(function() {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Delay initialization slightly to ensure all other scripts are loaded
      setTimeout(initLanguageSwitching, 500);
    });
  } else {
    // DOM already loaded, but still delay slightly
    setTimeout(initLanguageSwitching, 500);
  }

  // Track if popup has been shown
  let popupShown = false;

  // Track initialization state
  let isInitializing = false;
  let isLanguageSwitching = false;
  let isComponentLoading = false;

  function initLanguageSwitching() {
    // Prevent multiple simultaneous initializations
    if (isInitializing || isComponentLoading) {
      console.log("Initialization or component loading in progress, skipping language switch init...");
      return;
    }

    // Prevent initialization during language switch
    if (isLanguageSwitching) {
      console.log("Language switch in progress, skipping initialization...");
      return;
    }

    console.log("Language switch initialization");
    isInitializing = true;
    
    try {
      // First cleanup any existing handlers
      cleanupExistingHandlers();
      
      // Then initialize new handlers
      setupLanguageSwitchHandlers();
      
      // Mark active language in UI
      updateActiveLanguageUI();
      
      // Check if we should show the popup
      const shouldShowPopup = !sessionStorage.getItem('languagePopupShown') && 
                            !sessionStorage.getItem('preferredLanguage');
      
      if (shouldShowPopup) {
        // Delay popup check slightly to ensure DOM is stable
        setTimeout(checkBrowserLanguage, 1000);
      }
    } finally {
      isInitializing = false;
    }
    
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
    // Set flag to prevent reinitialization during switch
    isLanguageSwitching = true;
    isComponentLoading = true;
    
    // Get current page
    const currentPath = window.location.pathname;
    let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    // Fallback für Root-URL
    if (!currentPage || currentPage === '' || currentPage === '/') {
      currentPage = 'index.html';
    }
    const isEnglish = currentPage.includes('_en');
    
    console.log("Switching to language:", lang, "Current page:", currentPage, "Is English:", isEnglish);
    
    // Prevent unnecessary navigation
    if ((lang === 'en' && isEnglish) || (lang === 'de' && !isEnglish)) {
      console.log("Already on requested language page");
      isLanguageSwitching = false;
      isComponentLoading = false;
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

    // Set a timeout to reset flags in case navigation fails
    setTimeout(() => {
      isLanguageSwitching = false;
      isComponentLoading = false;
    }, 10000); // 10 seconds timeout
    
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
      // Skip if we're in the middle of a language switch or component loading
      if (isLanguageSwitching || isComponentLoading) {
        console.log("Language switch or component loading in progress, skipping mutation observer...");
        return;
      }

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
          }, 500); // Increased delay to 500ms
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
    // Skip if components are loading
    if (isComponentLoading) {
      console.log("Component loading in progress, skipping navigation opened handler");
      return;
    }
    // Throttle to prevent multiple calls
    if (!window.languageSwitchNavTimeout) {
      window.languageSwitchNavTimeout = setTimeout(() => {
        initLanguageSwitching();
        window.languageSwitchNavTimeout = null;
      }, 500); // Increased delay to 500ms
    }
  });
  
  window.addEventListener('navigationUpdated', function() {
    console.log("Navigation updated event received");
    // Skip if components are loading
    if (isComponentLoading) {
      console.log("Component loading in progress, skipping navigation updated handler");
      return;
    }
    // Throttle to prevent multiple calls
    if (!window.languageSwitchUpdateTimeout) {
      window.languageSwitchUpdateTimeout = setTimeout(() => {
        initLanguageSwitching();
        window.languageSwitchUpdateTimeout = null;
      }, 500); // Increased delay to 500ms
    }
  });
  
  // Set up the observer for dynamic content loading
  setupMutationObserver();

  // Check browser language and show popup if needed
  function checkBrowserLanguage() {
    console.log("Checking browser language..."); // Debug log
    
    // Get current page
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    
    // Only show popup on German pages (not on _en versions)
    if (currentPage.includes('_en')) {
      console.log("English page detected, not showing popup"); // Debug log
      return;
    }

    // Get browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const isEnglishBrowser = browserLang.toLowerCase().startsWith('en');
    console.log("Browser language:", browserLang, "Is English:", isEnglishBrowser); // Debug log

    // If browser is set to English, show the language popup
    if (isEnglishBrowser) {
      console.log("Showing language popup for English browser"); // Debug log
      showLanguagePopup();
      // Mark that we've shown the popup
      sessionStorage.setItem('languagePopupShown', 'true');
    }
  }

  // Show language selection popup
  function showLanguagePopup() {
    console.log("Creating language popup..."); // Debug log

    // Create a container div that will hold both overlay and popup
    const container = document.createElement('div');
    container.id = 'language-popup-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 32, 38, 0.55);
    `;

    // Create popup (modern design)
    const popup = document.createElement('div');
    popup.className = 'lang-popup lang-popup-variant2b';
    popup.innerHTML = `
      <div class="lang-popup-gradient-card">
        <div class="lang-popup-logo lang-popup-logo-optimized">
          <img src="assets/pictures/imt_logo.png" alt="Logo" />
        </div>
        <h3 style="margin: 0 0 14px 0; font-size: 1.35rem; color: #fff; font-weight: 700;">Language Preference</h3>
        <p style="color: #f5f5f7; font-size: 1.05rem; margin-bottom: 28px; line-height: 1.5;">Your browser is set to English.<br>Would you like to view this site in English?</p>
        <div class="lang-popup-actions">
          <button class="lang-btn lang-btn-primary">Yes, English</button>
          <button class="lang-btn lang-btn-secondary">No, stay in German</button>
        </div>
      </div>
    `;
    popup.style.cssText = `
      position: relative;
      background: none;
      border-radius: 22px;
      box-shadow: none;
      max-width: 370px;
      width: 100%;
      text-align: center;
      z-index: 1000000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    // Add styles for the popup (from language_popup.html)
    const style = document.createElement('style');
    style.textContent = `
      .lang-popup-gradient-card {
        background: linear-gradient(135deg,#6e45e2 0%,#970289 100%);
        color: #fff;
        border-radius: 22px;
        box-shadow: none;
        padding: 44px 36px 32px;
        width: 100%;
        text-align: center;
        animation: popup-fade-in 0.5s;
      }
      .lang-popup-logo-optimized {
        margin-bottom: 36px;
        display: flex;
        justify-content: center;
        background: #fff;
        padding: 16px 18px;
        border-radius: 12px;
        box-shadow: 0 4px 18px rgba(110,69,226,0.13), 0 1.5px 6px rgba(0,0,0,0.07);
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
        min-width: 120px;
        max-width: 220px;
      }
      .lang-popup-logo-optimized img {
        width: 100%;
        max-width: 220px;
        height: auto;
        border-radius: 0;
        background: none;
        box-shadow: none;
        display: block;
        margin: 0 auto;
        border: none;
        object-fit: contain;
      }
      .lang-popup-actions {
        display: flex;
        gap: 14px;
        justify-content: center;
      }
      .lang-btn {
        border: none;
        border-radius: 10px;
        padding: 12px 26px;
        font-size: 1.05rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        box-shadow: 0 2px 8px rgba(110,69,226,0.07);
      }
      .lang-btn-primary {
        background: #fff;
        color: #6e45e2;
      }
      .lang-btn-primary:hover {
        background: #ece9f7;
      }
      .lang-btn-secondary {
        background: transparent;
        color: #fff;
        border: 1.5px solid #fff;
      }
      .lang-btn-secondary:hover {
        background: rgba(255,255,255,0.08);
      }
      @media (max-width: 600px) {
        .lang-popup-gradient-card {
          padding: 22px 4vw 18px;
          max-width: 98vw;
        }
        .lang-popup-logo-optimized {
          min-width: 120px;
          max-width: 220px;
        }
        .lang-popup-logo-optimized img {
          min-width: 120px;
          max-width: 220px;
        }
      }
      @keyframes popup-fade-in {
        from { opacity: 0; transform: translateY(30px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    const primaryBtn = popup.querySelector('.lang-btn-primary');
    const secondaryBtn = popup.querySelector('.lang-btn-secondary');

    const removePopup = () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
        document.body.style.overflow = '';
      }
    };

    primaryBtn.addEventListener('click', () => {
      sessionStorage.setItem('preferredLanguage', 'en');
      removePopup();
      switchToLanguage('en');
    });

    secondaryBtn.addEventListener('click', () => {
      sessionStorage.setItem('preferredLanguage', 'de');
      removePopup();
    });

    // Add popup to container
    container.appendChild(popup);
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';
  }
})(); 