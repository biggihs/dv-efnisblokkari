// Popup script for DV Content Blocker
// Cross-browser compatibility layer
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener('DOMContentLoaded', async function() {
    const toggle433 = document.getElementById('toggle433');
    const toggleFokus = document.getElementById('toggleFokus');
    const toggleEyjan = document.getElementById('toggleEyjan');
    const toggleKynning = document.getElementById('toggleKynning');
    const toggleAds = document.getElementById('toggleAds');
    const toggleAll = document.getElementById('toggleAll');
    const statusText = document.getElementById('statusText');

    // Load current state
    try {
        // First try to get settings from storage
        const result = await browserAPI.storage.sync.get(['block433', 'blockFokus', 'blockEyjan', 'blockKynning', 'blockAds']);
        
        // Create settings with defaults
        const settings = {
            block433: result.block433 !== false, // Default to true if undefined/null
            blockFokus: result.blockFokus !== false, // Default to true if undefined/null
            blockEyjan: result.blockEyjan !== false, // Default to true if undefined/null
            blockKynning: result.blockKynning !== false, // Default to true if undefined/null
            blockAds: result.blockAds !== false // Default to true if undefined/null
        };
        
        // If storage is empty, initialize with defaults
        if (Object.values(result).every(val => val === undefined)) {
            await browserAPI.storage.sync.set(settings);
        }
        
        updateUI(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
        // Fall back to defaults if storage fails
        const defaultSettings = {
            block433: true,
            blockFokus: true,
            blockEyjan: true,
            blockKynning: true,
            blockAds: true
        };
        updateUI(defaultSettings);
        statusText.textContent = 'Using default settings';
    }

    // Handle individual toggle clicks
    toggle433.addEventListener('click', function() {
        handleToggleClick('433', toggle433);
    });

    toggleFokus.addEventListener('click', function() {
        handleToggleClick('fokus', toggleFokus);
    });

    toggleEyjan.addEventListener('click', function() {
        handleToggleClick('eyjan', toggleEyjan);
    });

    toggleKynning.addEventListener('click', function() {
        handleToggleClick('kynning', toggleKynning);
    });

    toggleAds.addEventListener('click', function() {
        handleToggleClick('ads', toggleAds);
    });

    // Handle "block all" toggle
    toggleAll.addEventListener('click', async function() {
        const allEnabled = toggle433.classList.contains('active') && 
                          toggleFokus.classList.contains('active') && 
                          toggleEyjan.classList.contains('active') &&
                          toggleKynning.classList.contains('active') &&
                          toggleAds.classList.contains('active');
        const newState = !allEnabled;
        
        const settings = {
            block433: newState,
            blockFokus: newState,
            blockEyjan: newState,
            blockKynning: newState,
            blockAds: newState
        };
        
        try {
            await browserAPI.storage.sync.set(settings);
            updateUI(settings);
            notifyContentScript(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    });

    async function handleToggleClick(contentType, toggleElement) {
        const currentlyActive = toggleElement.classList.contains('active');
        const newState = !currentlyActive;
        
        // Map content types to correct storage keys
        const keyMap = {
            '433': 'block433',
            'fokus': 'blockFokus', 
            'eyjan': 'blockEyjan',
            'kynning': 'blockKynning',
            'ads': 'blockAds'
        };
        const storageKey = keyMap[contentType];
        
        try {
            await browserAPI.storage.sync.set({ [storageKey]: newState });
            
            // Reload all settings to update UI
            const result = await browserAPI.storage.sync.get(['block433', 'blockFokus', 'blockEyjan', 'blockKynning', 'blockAds']);
            const settings = {
                block433: result.block433 !== false,
                blockFokus: result.blockFokus !== false,
                blockEyjan: result.blockEyjan !== false,
                blockKynning: result.blockKynning !== false,
                blockAds: result.blockAds !== false
            };
            updateUI(settings);
            notifyContentScript(settings);
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    }

    async function notifyContentScript(settings) {
        try {
            const tabs = await browserAPI.tabs.query({ active: true, currentWindow: true });
            if (tabs[0] && tabs[0].url && tabs[0].url.includes('dv.is')) {
                await browserAPI.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: settings
                });
            }
        } catch (error) {
            // Content script may not be loaded yet, ignore error
            console.log('Could not notify content script:', error);
        }
    }

    function updateUI(settings) {
        // Update individual toggles
        updateToggle(toggle433, settings.block433);
        updateToggle(toggleFokus, settings.blockFokus);
        updateToggle(toggleEyjan, settings.blockEyjan);
        updateToggle(toggleKynning, settings.blockKynning);
        updateToggle(toggleAds, settings.blockAds);
        
        // Update "block all" toggle
        const allEnabled = settings.block433 && settings.blockFokus && settings.blockEyjan && settings.blockKynning && settings.blockAds;
        updateToggle(toggleAll, allEnabled);
        
        // Update status text
        const blockedTypes = [];
        if (settings.block433) blockedTypes.push('433');
        if (settings.blockFokus) blockedTypes.push('Fókus');
        if (settings.blockEyjan) blockedTypes.push('Eyjan');
        if (settings.blockKynning) blockedTypes.push('Kynning');
        if (settings.blockAds) blockedTypes.push('Auglýsingar');
        
        if (blockedTypes.length === 0) {
            statusText.textContent = 'All content visible';
            statusText.className = 'status-text status-inactive';
        } else if (blockedTypes.length === 5) {
            statusText.textContent = 'All content types blocked';
            statusText.className = 'status-text status-active';
        } else {
            statusText.textContent = `Blocking: ${blockedTypes.join(', ')}`;
            statusText.className = 'status-text status-active';
        }
    }

    function updateToggle(toggleElement, isActive) {
        if (isActive) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }
});