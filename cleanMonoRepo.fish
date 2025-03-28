#!/usr/bin/env fish

function clean_monorepo
    # Start from monorepo root: ~/DealerProEdge/platforms-payload-dpe
    rm -rf node_modules
    
    # Go to website directory and clean
    cd website
    rm -rf node_modules .next
    
    # Go back up and into payload directory and clean
    cd ../payload
    rm -rf node_modules .next
    
    # Return to monorepo root
    cd ..
end

# Execute the function
clean_monorepo
