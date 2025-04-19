function doPost(e) {
  // Konfiguration
  const SPREADSHEET_ID = ''; // Hier Ihre Sheet-ID einfügen
  const SHEET_NAME = 'Formular-Antworten';
  
  try {
    // Parse JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Öffne das Spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Erstelle Sheet wenn es nicht existiert
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Füge Header hinzu
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Zeitstempel',
        'Programm',
        'Vorname',
        'Nachname',
        'E-Mail',
        'Land',
        'E-Mail-Zustimmung'
      ]]);
    }
    
    // Füge neue Zeile hinzu
    sheet.appendRow([
      new Date(),
      data.programm,
      data.vorname,
      data.nachname,
      data.email,
      data.land,
      data.zustimmung
    ]);
    
    // Sende Erfolgsantwort
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Sende Fehlerantwort
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
} 