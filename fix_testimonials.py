#!/usr/bin/env python3
import re
import os
import sys

# List of files to modify
files = [
    "integrated_management_strategy.html",
    "financial_management.html",
    "inspirational_leadership.html",
    "marketing_sales_brand_communication.html",
    "intelligent_process_automation.html",
    "ki_business_strategy_digital_transformation.html",
    "ki_augmented_decision_making.html",
    "management_programm.html",
    "management_programm_cas.html",
    "fast_track_mba.html"
]

# The CSS fix to add to each media query
css_fix = """
            .gradient-quote-footer {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .gradient-person {
              margin-bottom: 15px;
              width: 100%;
            }
            
            .gradient-info {
              flex: 1;
            }
            
            .gradient-company {
              align-self: flex-start;
              margin-top: 5px;
            }
            
            .gradient-position {
              min-height: unset;
              margin-bottom: 5px;
            }"""

# Process each file
for filename in files:
    print(f"Processing {filename}...")
    
    try:
        # Read the file content
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Find the style section with gradient-quotes
        style_pattern = r'(<style>.*?\.gradient-quotes.*?</style>)'
        style_match = re.search(style_pattern, content, re.DOTALL)
        
        if not style_match:
            print(f"  ✗ Couldn't find the gradient-quotes style section in {filename}")
            continue
        
        style_section = style_match.group(0)
        
        # Find the media query section within the style
        media_pattern = r'(@media\s*\(max-width:\s*768px\s*\)\s*\{[^}]*\.gradient-quotes[^}]*\}[^}]*\})'
        media_match = re.search(media_pattern, style_section, re.DOTALL)
        
        if not media_match:
            # If no media query found, let's add one right before the </style> tag
            print(f"  ⚠ No media query found, adding a new one")
            new_style_section = style_section.replace('</style>', f"""
          @media (max-width: 768px) {{
            .gradient-quotes {{
              grid-template-columns: 1fr;
            }}{css_fix}
          }}
        </style>""")
            modified_content = content.replace(style_section, new_style_section)
        else:
            # If media query found, enhance it
            media_query = media_match.group(0)
            
            # Check if it already has our fix
            if "gradient-quote-footer" in media_query:
                print(f"  ✓ Fix already applied to {filename}")
                continue
                
            # Replace the basic media query with our enhanced one
            new_media_query = re.sub(
                r'(\.gradient-quotes\s*\{\s*grid-template-columns:\s*1fr;\s*\})',
                f'.gradient-quotes {{\n              grid-template-columns: 1fr;\n            }}{css_fix}',
                media_query
            )
            
            modified_content = content.replace(media_query, new_media_query)
        
        # Write the modified content back to the file
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(modified_content)
            
        print(f"  ✓ Successfully updated {filename}")
            
    except Exception as e:
        print(f"  ✗ Error processing {filename}: {str(e)}")

print("All files processed.") 