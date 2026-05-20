# DV Content Blocker - Claude Development Notes

## Project Overview
Firefox extension for dv.is that replaces content images from specific categories with colored blocks to help users focus on desired content types.

## Content Types & Styling
- **433 Sports** (⚽): Green blocks (#28a745) - "Íþróttefni falið"
- **Fókus** (🎭): Purple blocks (#6B287F) - "Fókus efni falið"
- **Eyjan** (🏝️): Red blocks (#e74c3c) - "Eyjan efni falið"
- **Kynning** (📢): Orange blocks (#f39c12) - "Kynning efni falið"

## Key Technical Details

### Content Detection
- **CSS Classes**: `.f_433`, `.f_fokus`, `.f_eyjan`, `.f_lifsstill`, `.enskiboltinn`, `.kynning`
- **URL Pattern Matching**: For slider content type detection

### Storage Keys
Uses browser.storage.sync with keys:
- `block433` (boolean)
- `blockFokus` (boolean)
- `blockEyjan` (boolean)
- `blockKynning` (boolean)

**CRITICAL**: Storage key mapping in popup.js uses keyMap to avoid bugs:
```javascript
const keyMap = {
    '433': 'block433',
    'fokus': 'blockFokus',
    'eyjan': 'blockEyjan',
    'kynning': 'blockKynning'
};
```

### Files Structure
- `manifest.json` - Extension configuration (Manifest V2)
- `content.js` - Main blocking logic (~500 lines)
- `popup.html` - Toggle interface with color-coded switches
- `popup.js` - Settings management and UI updates
- `background.js` - Default settings initialization and state management
- `styles.css` - CSS for blocked content styling
- `README.md` - User documentation

## Known Issues Fixed
1. **Storage Key Bug**: Fixed '433' → 'block4' instead of 'block433' mapping
2. **Popup Initial State**: Fixed by ensuring background.js sets defaults on startup
3. **Visual Layout**: Preserves original image dimensions using getComputedStyle
4. **Slider Content**: Special processing for slick-carousel elements
5. **Ad Styling**: Simplified from animated text to plain white blocks

## Development Commands
No specific build process required - load as temporary extension in Firefox.

## Browser Compatibility
- **Firefox**: Manifest V2, uses `browser` API namespace
- **Chrome**: Manifest V3, uses `chrome` API namespace, service worker background
- Cross-browser compatibility layer: `const browserAPI = typeof browser !== 'undefined' ? browser : chrome;`
- Runs only on www.dv.is domain

## Build System
- `./build.sh` - Creates separate packages for Firefox and Chrome
- `manifest.json` + `background.js` - Firefox version (Manifest V2)
- `manifest-chrome.json` + `background-chrome.js` - Chrome version (Manifest V3)

## User Experience Notes
- All blocking enabled by default
- Individual toggles + "Block All" master toggle
- Real-time blocking with MutationObserver for dynamic content
- Settings persist across browser sessions