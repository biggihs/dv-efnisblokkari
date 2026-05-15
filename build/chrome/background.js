// Background script for DV Efnisblokkari (Chrome Service Worker)
// Cross-browser compatibility layer
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

async function setDefaults() {
    try {
        const result = await browserAPI.storage.sync.get(['block433', 'blockFokus', 'blockEyjan', 'blockKynning', 'blockAds']);
        const defaults = {};
        if (result.block433 === undefined) defaults.block433 = true;
        if (result.blockFokus === undefined) defaults.blockFokus = true;
        if (result.blockEyjan === undefined) defaults.blockEyjan = true;
        if (result.blockKynning === undefined) defaults.blockKynning = true;
        if (result.blockAds === undefined) defaults.blockAds = true;
        
        if (Object.keys(defaults).length > 0) {
            await browserAPI.storage.sync.set(defaults);
        }
    } catch (error) {
        console.error('Error setting defaults:', error);
    }
}

// Service worker event listeners
browserAPI.runtime.onInstalled.addListener(() => {
    setDefaults();
});

browserAPI.runtime.onStartup.addListener(() => {
    setDefaults();
});

// Listen for messages from popup and content scripts
browserAPI.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'getState') {
        try {
            const result = await browserAPI.storage.sync.get(['block433', 'blockFokus', 'blockEyjan', 'blockKynning', 'blockAds']);
            sendResponse({ 
                block433: result.block433 !== false,
                blockFokus: result.blockFokus !== false,
                blockEyjan: result.blockEyjan !== false,
                blockKynning: result.blockKynning !== false,
                blockAds: result.blockAds !== false
            });
        } catch (error) {
            console.error('Error getting state:', error);
            sendResponse({ error: 'Failed to get state' });
        }
        return true; // Indicates we will send a response asynchronously
    }
});