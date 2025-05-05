/**
 * Script to update all specified HTML pages to include the language-switch initialization.
 * This script will add the language-switch initialization code to the specified HTML files.
 */

const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'financial_management.html',
  'inspirational_leadership.html',
  'marketing_sales_brand_communication.html',
  'intelligent_process_automation.html',
  'ki_business_strategy_digital_transformation.html',
  'ki_augmented_decision_making.html',
  'management_programm.html',
  'management_programm_cas.html',
  'fast_track_mba.html',
];

// Language initialization code to insert (German version)
const langInitCodeDE = `
        // Sprachumschalter initialisieren, nachdem die Navigation geladen wurde
        setTimeout(() => {
          if (typeof initLanguageSwitching === 'function') {
            initLanguageSwitching();
          } else if (window.switchLanguage) {
            console.log('Language-switch.js bereits geladen, verwende globale Funktion');
          } else {
            console.warn('Language-switch Funktionen nicht gefunden!');
          }
        }, 300);`;

// Language initialization code to insert (English version)
const langInitCodeEN = `
        // Initialize language switcher after navigation is loaded
        setTimeout(() => {
          if (typeof initLanguageSwitching === 'function') {
            initLanguageSwitching();
          } else if (window.switchLanguage) {
            console.log('Language-switch.js already loaded, using global function');
          } else {
            console.warn('Language-switch functions not found!');
          }
        }, 300);`;

// Update the files
filesToUpdate.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if the file already has the language switch initialization
  if (content.includes('initLanguageSwitching')) {
    console.log(`${filename} already has language-switch initialization`);
    return;
  }
  
  // Determine which language initialization code to use based on filename
  const langInit = filename.includes('_en.') ? langInitCodeEN : langInitCodeDE;
  
  // Find the location to insert the code
  // Look for typical navigation setTimeout blocks
  if (content.includes('setTimeout(function()') && content.includes('mobile-menu-btn')) {
    // Find the end of the setTimeout block
    const timeoutEndIndex = content.indexOf('}, 100);') + 8;
    if (timeoutEndIndex > 8) {
      // Insert the code after the setTimeout block
      content = content.slice(0, timeoutEndIndex) + langInit + content.slice(timeoutEndIndex);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filename} with language-switch initialization`);
    } else {
      console.log(`Couldn't find proper position in ${filename}`);
    }
  } else {
    // Look for the navigation load block
    const navLoadMatch = content.match(/document\.getElementById\('navigation-container'\)\.innerHTML = data;/);
    if (navLoadMatch) {
      const navLoadIndex = navLoadMatch.index + navLoadMatch[0].length;
      content = content.slice(0, navLoadIndex) + langInit + content.slice(navLoadIndex);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filename} with language-switch initialization`);
    } else {
      console.log(`Couldn't find navigation container in ${filename}`);
    }
  }
});

console.log('All done!'); 