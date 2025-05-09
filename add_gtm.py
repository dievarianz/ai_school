#!/usr/bin/env python3
import os
import re
import glob

# Google Tag Manager Snippets
GTM_HEAD = '''<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KBG73BVB');</script>
<!-- End Google Tag Manager -->'''

GTM_BODY = '''<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBG73BVB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->'''

# Funktion zum Prüfen, ob GTM-Head bereits vorhanden ist
def gtm_head_exists(content):
    return 'GTM-KBG73BVB' in content and '<!-- Google Tag Manager -->' in content

# Funktion zum Prüfen, ob GTM-Body bereits vorhanden ist
def gtm_body_exists(content):
    return 'GTM-KBG73BVB' in content and '<!-- Google Tag Manager (noscript) -->' in content

# Funktion zum Einfügen des GTM-Head-Codes
def add_gtm_head(content):
    # Wenn der GTM-Head-Code bereits vorhanden ist, keine Änderung vornehmen
    if gtm_head_exists(content):
        return content
    
    # Suche nach dem Ende des <head>-Tags
    head_end_match = re.search(r'</head>', content, re.IGNORECASE)
    if head_end_match:
        # Füge GTM-Code vor dem </head>-Tag ein
        insert_pos = head_end_match.start()
        return content[:insert_pos] + GTM_HEAD + '\n' + content[insert_pos:]
    return content

# Funktion zum Einfügen des GTM-Body-Codes
def add_gtm_body(content):
    # Wenn der GTM-Body-Code bereits vorhanden ist, keine Änderung vornehmen
    if gtm_body_exists(content):
        return content
    
    # Suche nach dem öffnenden <body>-Tag
    body_start_match = re.search(r'<body[^>]*>', content, re.IGNORECASE)
    if body_start_match:
        # Füge GTM-Code nach dem <body>-Tag ein
        insert_pos = body_start_match.end()
        return content[:insert_pos] + '\n' + GTM_BODY + content[insert_pos:]
    return content

# Funktion zum Verarbeiten einer einzelnen Datei
def process_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Prüfe, ob es sich um eine vollständige HTML-Datei handelt
        if '<html' not in content or '<head' not in content or '<body' not in content:
            print(f"Überspringe {file_path} - keine vollständige HTML-Datei")
            return
        
        # Variablen zum Nachverfolgen von Änderungen
        head_modified = False
        body_modified = False
        
        # Füge GTM-Head-Code ein, wenn noch nicht vorhanden
        if not gtm_head_exists(content):
            content = add_gtm_head(content)
            head_modified = True
        
        # Füge GTM-Body-Code ein, wenn noch nicht vorhanden
        if not gtm_body_exists(content):
            content = add_gtm_body(content)
            body_modified = True
        
        # Wenn der Inhalt geändert wurde, speichere ihn
        if head_modified or body_modified:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            
            if head_modified and body_modified:
                print(f"GTM Head und Body in {file_path} hinzugefügt")
            elif head_modified:
                print(f"GTM Head in {file_path} hinzugefügt")
            elif body_modified:
                print(f"GTM Body in {file_path} hinzugefügt")
        else:
            print(f"Keine Änderungen in {file_path} notwendig - GTM bereits komplett vorhanden")
    
    except Exception as e:
        print(f"Fehler bei der Verarbeitung von {file_path}: {str(e)}")

# Hauptfunktion
def main():
    html_files = glob.glob('*.html')
    html_files.extend(glob.glob('*/*.html'))  # Auch HTML-Dateien in Unterverzeichnissen bearbeiten
    
    print(f"Gefundene HTML-Dateien: {len(html_files)}")
    
    for file_path in html_files:
        process_file(file_path)
    
    print("Skript abgeschlossen!")

if __name__ == "__main__":
    main() 