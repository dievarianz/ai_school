#!/usr/bin/env python3
import re
import os
import sys

# Liste der Dateien, die bearbeitet werden sollen
files = [
    "integrated_management_strategy.html",
    "integrated_management_strategy_en.html",
    "financial_management.html",
    "inspirational_leadership.html",
    "marketing_sales_brand_communication.html",
    "intelligent_process_automation.html",
    "ki_business_strategy_digital_transformation.html",
    "ki_augmented_decision_making.html",
    "management_programm.html",
    "management_programm_cas.html",
    "fast_track_mba.html",
    "ki_excellence_programm.html",
    "ki_excellence_programm_en.html"
]

# Der CSS-Fix, der zu jeder Datei hinzugefügt werden soll
css_fix = """      /* Safari-Fix: Verhindern der Überlagerung bei Safari Mobile */
      aspect-ratio: auto;
      height: auto;
      margin-bottom: 30px;
      /* Garantiert, dass die Galerie nicht über andere Elemente hinausragt */
      overflow: hidden;
    }
    
    /* Safari-spezifischer Fix */
    @supports (-webkit-touch-callout: none) {
      .gallery {
        aspect-ratio: auto;
        height: auto;
        max-height: none;
        margin-bottom: 40px;
      }
      
      .gallery-item {
        height: 200px;
        min-height: 200px;
        max-height: 200px;
      }
    }"""

# Jede Datei bearbeiten
for filename in files:
    print(f"Bearbeite {filename}...")
    
    try:
        # Dateiinhalt einlesen
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Prüfe zuerst, ob der Fix bereits vorhanden ist
        if "Safari-Fix" in content:
            print(f"  ✓ Fix wurde bereits in {filename} angewendet")
            continue
        
        # Verschiedene Muster zur Erkennung des Media Query Blocks
        patterns = [
            r'(@media\s*\(max-width:\s*768px\s*\)\s*\{\s*\.gallery\s*\{[^}]*\})',  # Standard-Muster
            r'(@media\s*\(max-width:\s*768px\s*\)[^{]*\{[^{]*\.gallery\s*\{[^}]*\})', # Alternatives Muster
            r'(@media\s*\([^)]*\)\s*\{[^{]*\.gallery\s*\{[^}]*\})'  # Allgemeineres Muster
        ]
        
        found_match = False
        for pattern in patterns:
            mobile_gallery_match = re.search(pattern, content, re.DOTALL)
            if mobile_gallery_match:
                mobile_gallery_css = mobile_gallery_match.group(0)
                
                # Finde das letzte schließende } im gefundenen CSS-Block
                last_closing_brace_index = mobile_gallery_css.rfind("}")
                if last_closing_brace_index != -1:
                    fixed_mobile_gallery_css = mobile_gallery_css[:last_closing_brace_index] + css_fix
                    
                    # Ersetze den alten CSS-Block durch den neuen
                    modified_content = content.replace(mobile_gallery_css, fixed_mobile_gallery_css)
                    
                    # Speichere die geänderte Datei
                    with open(filename, 'w', encoding='utf-8') as file:
                        file.write(modified_content)
                    
                    print(f"  ✓ {filename} erfolgreich aktualisiert")
                    found_match = True
                    break
                else:
                    print(f"  ✗ Konnte die schließende Klammer im Gallery Mobile CSS Block in {filename} nicht finden")
        
        if not found_match:
            # Alternativer Ansatz: Suche nach dem Abschnitt "Responsive Design"
            responsive_section = re.search(r'/\*\s*Responsive Design\s*\*/(.*?)@media\s*\(max-width:\s*768px\s*\)\s*\{', content, re.DOTALL)
            if responsive_section:
                # Finde den @media-Block und den ersten .gallery-Block darin
                media_block_start = content.find("@media", responsive_section.start())
                if media_block_start != -1:
                    gallery_in_media = re.search(r'\.gallery\s*\{[^}]*\}', content[media_block_start:], re.DOTALL)
                    if gallery_in_media:
                        gallery_css = gallery_in_media.group(0)
                        gallery_end = media_block_start + gallery_in_media.end()
                        
                        # Füge den Safari-Fix nach dem .gallery-Block ein
                        modified_content = content[:gallery_end] + css_fix + content[gallery_end:]
                        
                        # Speichere die geänderte Datei
                        with open(filename, 'w', encoding='utf-8') as file:
                            file.write(modified_content)
                        
                        print(f"  ✓ {filename} erfolgreich aktualisiert (alternativer Ansatz)")
                        found_match = True
        
        if not found_match:
            # Als letzter Ausweg: Manuelles Einfügen
            print(f"  ⚠ Konnte keinen geeigneten Einfügepunkt in {filename} finden")
            print(f"  ℹ Manuelles Hinzufügen erforderlich")
            
    except Exception as e:
        print(f"  ✗ Fehler beim Bearbeiten von {filename}: {str(e)}")

print("Alle Dateien wurden bearbeitet.") 