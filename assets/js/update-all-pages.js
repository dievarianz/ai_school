/**
 * Script to update all HTML pages to include the language-switch.js file
 * 
 * This script should be run to add the language-switch.js script tag to all HTML pages.
 * It will search for all .html files in the current directory and subdirectories.
 */

const fs = require('fs');
const path = require('path');

// Function to find all HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      // Recursively search directories
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      // Add HTML files to list
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update an HTML file
function updateHtmlFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the language-switch.js is already included
  if (content.includes('language-switch.js')) {
    console.log('  Already has language-switch.js');
    return;
  }
  
  // Find the best place to insert the script tag
  // Typically before the closing </body> tag, after other scripts
  const bodyEndIndex = content.lastIndexOf('</body>');
  
  if (bodyEndIndex === -1) {
    console.log('  No </body> tag found, skipping');
    return;
  }
  
  // Add the script tag
  const scriptTag = `  <!-- Language Switch Script -->
  <script src="assets/js/language-switch.js"></script>
  
`;
  
  // Insert the script tag before </body>
  const updatedContent = content.substring(0, bodyEndIndex) + scriptTag + content.substring(bodyEndIndex);
  
  // Write the updated content back
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('  Updated successfully');
}

// Main function
function main() {
  console.log('Searching for HTML files...');
  const htmlFiles = findHtmlFiles('.');
  console.log(`Found ${htmlFiles.length} HTML files`);
  
  console.log('\nUpdating files:');
  htmlFiles.forEach(file => {
    updateHtmlFile(file);
  });
  
  console.log('\nAll done!');
}

// Run the script
main(); 