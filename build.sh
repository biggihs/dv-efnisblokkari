#!/bin/bash

# Build script for cross-browser DV Content Blocker extension

echo "Building DV Content Blocker for Firefox and Chrome..."

# Clean previous builds
rm -rf build/
mkdir -p build/firefox build/chrome

# Shared files for both browsers
cp popup.html popup.js content.js styles.css icon.png README.md build/firefox/
cp popup.html popup.js content.js styles.css icon.png README.md build/chrome/

# Firefox-specific files
cp manifest.json background.js build/firefox/

# Chrome-specific files  
cp manifest-chrome.json build/chrome/manifest.json
cp background-chrome.js build/chrome/background.js

# Create zip packages
cd build/firefox
zip -r ../dv-content-blocker-firefox.zip .
echo "Firefox extension built: build/dv-content-blocker-firefox.zip"

cd ../chrome
zip -r ../dv-content-blocker-chrome.zip .
echo "Chrome extension built: build/dv-content-blocker-chrome.zip"

cd ../../
echo "Build complete!"
echo ""
echo "Firefox: Load build/firefox/ as temporary extension"
echo "Chrome: Load build/chrome/ as unpacked extension"
echo ""
echo "For store submission:"
echo "  Firefox: Upload build/dv-content-blocker-firefox.zip to addons.mozilla.org"
echo "  Chrome: Upload build/dv-content-blocker-chrome.zip to Chrome Web Store"