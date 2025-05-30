// Global Popup System
// Zeigt das Voucher Popup nach 10 Sekunden an, einmalig pro Nutzer

(function() {
    'use strict';
    
    // Konfiguration
    const POPUP_DELAY = 15000; // 15 Sekunden
    const STORAGE_KEY = 'voucher_popup_submitted';
    
    // Prüfen ob Popup bereits erfolgreich ausgefüllt wurde
    function hasPopupBeenSubmitted() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    
    // Popup als erfolgreich ausgefüllt markieren
    function markPopupAsSubmitted() {
        localStorage.setItem(STORAGE_KEY, 'true');
    }
    
    // Event Listener für erfolgreiche Form-Submissions
    function setupFormSubmissionListener() {
        // Überwache alle Form-Submissions im Popup-Container
        document.addEventListener('submit', function(event) {
            const form = event.target;
            const popupContainer = document.getElementById('voucher-popup-container');
            
            // Prüfe ob das Form im Popup-Container ist
            if (popupContainer && popupContainer.contains(form)) {
                // Prüfe ob es ein Newsletter/Voucher Form ist
                const formName = form.getAttribute('name');
                if (formName && (formName.includes('newsletter') || formName.includes('voucher'))) {
                    console.log('Newsletter/Voucher Form erfolgreich abgeschickt');
                    markPopupAsSubmitted();
                }
            }
        });
        
        // Alternative: Überwache auch erfolgreiche Netlify-Submissions
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'form-submit-success') {
                console.log('Netlify Form erfolgreich abgeschickt');
                markPopupAsSubmitted();
            }
        });
    }
    
    // Bestimme die aktuelle Sprache basierend auf der URL
    function getCurrentLanguage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        const language = currentPage.includes('_en') ? 'en' : 'de';
        console.log(`DEBUG: Current page: ${currentPage}, Detected language: ${language}`);
        return language;
    }
    
    // Lade die entsprechende Popup-Komponente
    function loadPopupComponent(language) {
        const popupFile = language === 'en' ? 
            'components/globals/voucher_popup_en.html' : 
            'components/globals/voucher_popup.html';
        
        console.log(`DEBUG: Loading popup component: ${popupFile} for language: ${language}`);
        
        return fetch(`${popupFile}?t=${new Date().getTime()}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`Fehler beim Laden des Voucher Popups: ${response.status}`);
                    // Fallback zum includes-Verzeichnis versuchen
                    const fallbackFile = language === 'en' ? 
                        'components/includes/voucher_popup_en.html' : 
                        'components/includes/voucher_popup.html';
                    console.log(`DEBUG: Trying fallback: ${fallbackFile}`);
                    return fetch(`${fallbackFile}?t=${new Date().getTime()}`)
                        .then(resp => {
                            if (!resp.ok) {
                                console.error('Auch includes-Pfad fehlgeschlagen:', resp.status);
                                return '';
                            }
                            console.log(`DEBUG: Fallback successful: ${fallbackFile}`);
                            return resp.text();
                        });
                }
                console.log(`DEBUG: Primary popup loaded successfully: ${popupFile}`);
                return response.text();
            })
            .catch(error => {
                console.error('Fehler beim Laden des Voucher Popups:', error);
                return '';
            });
    }
    
    // Erstelle Popup-Container falls nicht vorhanden
    function createPopupContainer() {
        let container = document.getElementById('voucher-popup-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'voucher-popup-container';
            document.body.appendChild(container);
        }
        return container;
    }
    
    // Führe Skripte im geladenen Popup aus
    function executePopupScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = script.textContent;
            script.parentNode.replaceChild(newScript, script);
        });
    }
    
    // Zeige das Popup an
    function showPopup() {
        const language = getCurrentLanguage();
        const container = createPopupContainer();
        
        loadPopupComponent(language)
            .then(data => {
                if (data) {
                    container.innerHTML = data;
                    console.log('DEBUG: Voucher Popup HTML loaded and inserted into DOM');
                    
                    // Überprüfe den Inhalt des geladenen Popups
                    const popupTitle = container.querySelector('h3, .popup-title, [class*="title"]');
                    if (popupTitle) {
                        console.log(`DEBUG: Popup title found: ${popupTitle.textContent.trim()}`);
                    }
                    
                    // Skripte ausführen
                    executePopupScripts(container);
                    
                    // Popup anzeigen (nach kurzer Verzögerung für DOM-Aufbau)
                    setTimeout(() => {
                        if (typeof showNewsletterPopup === 'function') {
                            showNewsletterPopup();
                            console.log('DEBUG: Voucher Popup displayed successfully');
                        } else {
                            console.warn('DEBUG: showNewsletterPopup Funktion nicht gefunden!');
                        }
                    }, 100);
                } else {
                    console.warn('DEBUG: Keine Popup-Daten erhalten');
                }
            });
    }
    
    // Initialisierung
    function initGlobalPopup() {
        // Prüfen ob Popup bereits erfolgreich ausgefüllt wurde
        if (hasPopupBeenSubmitted()) {
            console.log('Voucher Popup bereits ausgefüllt, überspringe');
            return;
        }
        
        // Form-Submission-Listener einrichten
        setupFormSubmissionListener();
        
        console.log('Starte Voucher Popup Timer (15 Sekunden)');
        
        // Timer für Popup-Anzeige
        setTimeout(() => {
            // Nochmalige Prüfung vor Anzeige (falls in der Zwischenzeit ausgefüllt)
            if (!hasPopupBeenSubmitted()) {
                showPopup();
            }
        }, POPUP_DELAY);
    }
    
    // Starte das System wenn DOM bereit ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalPopup);
    } else {
        // DOM bereits geladen
        initGlobalPopup();
    }
    
    // Exportiere Funktionen für manuellen Zugriff (falls benötigt)
    window.globalPopup = {
        reset: function() {
            localStorage.removeItem(STORAGE_KEY);
            console.log('Popup Status zurückgesetzt');
        },
        show: function() {
            showPopup();
        },
        hasBeenSubmitted: hasPopupBeenSubmitted,
        markAsSubmitted: markPopupAsSubmitted
    };
    
})(); 