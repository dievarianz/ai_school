#!/bin/bash

# List of files to modify
FILES=(
  integrated_management_strategy.html
  financial_management.html
  inspirational_leadership.html
  marketing_sales_brand_communication.html
  intelligent_process_automation.html
  ki_business_strategy_digital_transformation.html
  ki_augmented_decision_making.html
  management_programm.html
  management_programm_cas.html
  fast_track_mba.html
)

# CSS fix to add
CSS_FIX='
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
            }'

# Process each file
for file in "${FILES[@]}"; do
  echo "Processing $file..."
  
  # Add the CSS fix to the mobile media query
  sed -i '' 's/@media (max-width: 768px) {[[:space:]]*\.gradient-quotes {[[:space:]]*grid-template-columns: 1fr;[[:space:]]*}/@media (max-width: 768px) {\
            .gradient-quotes {\
              grid-template-columns: 1fr;\
            }'"$CSS_FIX"'/' "$file"
  
  echo "Done with $file"
done

echo "All files processed." 