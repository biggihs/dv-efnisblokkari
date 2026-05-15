# DV Content Blocker

A Firefox extension that replaces images from specific content categories on dv.is with colored blocks to help you focus on the content you want to read.

## What it does

This extension automatically detects and replaces content from five categories on dv.is:
- **433 Sports** (⚽) - Replaced with green blocks (#28a745)
- **Fókus** (🎭) - Replaced with purple blocks (#6B287F)
- **Eyjan** (🏝️) - Replaced with red blocks (#e74c3c)
- **Kynning** (📢) - Replaced with orange blocks (#f39c12)
- **Advertisements** (🚫) - Replaced with white blocks with black border and scrolling "Auglýsing" text

Each blocked element shows an appropriate icon and label indicating the content type that was hidden.

## Features

- **Individual Toggle Control**: Enable/disable blocking for each content type separately
- **"Block All" Option**: Quickly turn all blocking on or off
- **Smart Detection**: Automatically identifies content by CSS classes (`.f_433`, `.f_fokus`, `.f_eyjan`, `.f_lifsstill`) and ad elements (`.adbox`, `.adboxid`, `[data-zone*="adzone"]`)
- **Reversible**: Turn off blocking to see original images instantly
- **Real-time**: Works with dynamically loaded content
- **Visual Feedback**: Different colors and icons for each content type

## Installation

### For Development/Testing:

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to this folder and select the `manifest.json` file
5. The extension will be loaded and active on dv.is

### For Permanent Installation:

1. Zip the entire extension folder (manifest.json, content.js, styles.css)
2. Rename the zip file to have a .xpi extension
3. Drag and drop the .xpi file into Firefox to install

## How it works

The extension:

1. **Detects content types** by looking for:
   - **433 Sports**: Elements with `.f_433` class spans or `.enskiboltinn` class
   - **Fókus**: Elements with `.f_fokus` class spans
   - **Eyjan**: Elements with `.f_eyjan` class spans
   - **Kynning**: Elements with `.f_lifsstill` class spans or `.kynning` container class
   - **Advertisements**: Elements with `.adbox`, `.adboxid`, `.auglysing_ticker`, `[data-zone*="adzone"]` classes

2. **Replaces content** based on type:
   - **433**: Green blocks (#28a745) with "⚽ Íþróttefni falið" 
   - **Fókus**: Purple blocks (#6B287F) with "🎭 Fókus efni falið"
   - **Eyjan**: Red blocks (#e74c3c) with "🏝️ Eyjan efni falið"
   - **Kynning**: Orange blocks (#f39c12) with "📢 Kynning efni falið"
   - **Ads**: White blocks with black border and continuously scrolling "Auglýsing" text
   - Maintains original dimensions

3. **Monitors dynamic content** using MutationObserver to catch lazy-loaded images

## Usage

1. **Open Controls**: Click the extension icon in Firefox toolbar
2. **Individual Toggles**: Use separate switches for 433, Fókus, Eyjan, Kynning, and Advertisements
3. **Block All**: Use the master toggle to enable/disable all content types at once
4. **Status Display**: See which content types are currently being blocked

Images from enabled content types will be replaced with colored blocks. Disabled content shows original images.

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main content script that detects and replaces content images  
- `styles.css` - CSS styling for the colored blocks and indicators
- `popup.html` - Multi-toggle interface
- `popup.js` - Popup functionality with individual controls
- `background.js` - Extension background script for state management
- `README.md` - This documentation

## Compatibility

- Firefox 60+ (Manifest V2)
- Works specifically on www.dv.is

## Privacy

This extension only runs on dv.is and does not collect or transmit any data. All processing happens locally in your browser.