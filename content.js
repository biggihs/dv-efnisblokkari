// DV 433 Sports Blocker - Content Script
(function() {
    'use strict';

    // Extension state
    let blockingSettings = {
        block433: true,
        blockFokus: true,
        blockEyjan: true,
        blockKynning: true,
        blockAds: true
    };
    let originalImages = new Map(); // Store original background images

    // Function to check if element is an advertisement
    function isAdElement(element) {
        // Check for ad-related classes and attributes
        const adClasses = ['adbox', 'adboxid', 'auglysing', 'ad_'];
        const hasAdClass = adClasses.some(cls => 
            element.classList.contains(cls) || 
            element.className.includes(cls)
        );
        
        // Check for ad zone data attributes
        const hasAdZone = element.hasAttribute('data-zone') && 
                         element.getAttribute('data-zone').includes('adzone');
        
        // Check if parent has ad-related classes
        const parentHasAdClass = element.closest('.adbox, .adboxid, .auglysing_ticker, [class*="ad_"], [data-zone*="adzone"]');
        
        return hasAdClass || hasAdZone || parentHasAdClass;
    }

    // Function to check content type and return type info
    function getContentType(element) {
        // Check for ads first (highest priority)
        if (isAdElement(element)) {
            return { type: 'ads', shouldBlock: blockingSettings.blockAds };
        }
        
        // Check for different content types
        const has433Span = element.querySelector('.f_433');
        const hasFokusSpan = element.querySelector('.f_fokus');
        const hasEyjanSpan = element.querySelector('.f_eyjan');
        const hasKynningSpan = element.querySelector('.f_lifsstill');
        const hasKynningClass = element.classList.contains('kynning');
        const hasEnskiBoltinn = element.classList.contains('enskiboltinn');
        const parentHasEnskiBoltinn = element.closest('.enskiboltinn');
        
        if (has433Span || hasEnskiBoltinn || parentHasEnskiBoltinn) {
            return { type: '433', shouldBlock: blockingSettings.block433 };
        }
        if (hasFokusSpan) {
            return { type: 'fokus', shouldBlock: blockingSettings.blockFokus };
        }
        if (hasEyjanSpan) {
            return { type: 'eyjan', shouldBlock: blockingSettings.blockEyjan };
        }
        if (hasKynningSpan || hasKynningClass) {
            return { type: 'kynning', shouldBlock: blockingSettings.blockKynning };
        }
        
        return { type: null, shouldBlock: false };
    }

    // Legacy function for backward compatibility
    function is433Content(element) {
        const contentType = getContentType(element);
        return contentType.shouldBlock;
    }

    // Function to replace figure background images with colored blocks
    function replaceImageWithBlock(figure, contentType) {
        // Store original image if not already stored
        if (!originalImages.has(figure)) {
            const originalStyle = figure.getAttribute('style') || '';
            originalImages.set(figure, originalStyle);
        }
        
        // Get original computed styles to preserve dimensions
        const computedStyle = window.getComputedStyle(figure);
        const originalHeight = computedStyle.height;
        const originalWidth = computedStyle.width;
        const originalMaxHeight = computedStyle.maxHeight;
        const originalMinHeight = computedStyle.minHeight;
        
        // Define colors and labels for different content types
        const contentConfig = {
            '433': {
                color: '#28a745',
                icon: '⚽',
                label: 'Íþróttefni falið'
            },
            'fokus': {
                color: '#6B287F',
                icon: '🎭',
                label: 'Fókus efni falið'
            },
            'eyjan': {
                color: '#e74c3c',
                icon: '🏝️',
                label: 'Eyjan efni falið'
            },
            'kynning': {
                color: '#f39c12',
                icon: '📢',
                label: 'Kynning efni falið'
            },
            'ads': {
                color: 'white',
                icon: '',
                label: 'Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing Auglýsing '
            }
        };
        
        const config = contentConfig[contentType] || contentConfig['433'];
        
        // Remove background image and set colored block while preserving dimensions
        figure.style.backgroundImage = 'none';
        figure.style.backgroundColor = config.color;
        figure.style.display = 'flex';
        figure.style.alignItems = 'center';
        figure.style.justifyContent = 'center';
        
        // Preserve original dimensions - only set minHeight if it wasn't already set or is very small
        if (originalMinHeight === '0px' || originalMinHeight === 'auto') {
            // Only set a minimum height if the figure has no height constraints
            if (originalHeight === 'auto' || originalHeight === '0px') {
                figure.style.minHeight = '120px';
            }
        }
        
        // Add blocked content indicator if not already present
        if (!figure.querySelector('.content-blocked-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'content-blocked-indicator';
            indicator.textContent = `${config.icon} ${config.label}`;
            indicator.style.color = 'white';
            indicator.style.fontWeight = 'bold';
            indicator.style.textAlign = 'center';
            indicator.style.fontSize = '14px';
            indicator.style.background = 'rgba(0,0,0,0.7)';
            indicator.style.padding = '8px';
            indicator.style.borderRadius = '4px';
            indicator.style.maxWidth = '90%';
            indicator.style.wordBreak = 'break-word';
            figure.appendChild(indicator);
        }
    }

    // Legacy function for backward compatibility
    function replaceImageWithGreenBlock(figure) {
        replaceImageWithBlock(figure, '433');
    }

    // Function to restore original images
    function restoreOriginalImage(element) {
        const originalStyle = originalImages.get(element);
        if (originalStyle !== undefined) {
            element.setAttribute('style', originalStyle);
            
            // Remove blocked indicator (check all types)
            const indicator = element.querySelector('.content-blocked-indicator, .sports-blocked-indicator, .ad-blocked-indicator');
            if (indicator) {
                indicator.remove();
            }
            
            // For ad elements, restore original content if it was completely replaced
            if (element.querySelector('.ad-blocked-indicator') && element.innerHTML.includes('🚫 Auglýsing falin')) {
                // If original display was stored, restore it
                if (element.dataset.originalDisplay) {
                    element.style.display = element.dataset.originalDisplay;
                    delete element.dataset.originalDisplay;
                }
                if (element.dataset.originalVisibility) {
                    element.style.visibility = element.dataset.originalVisibility;
                    delete element.dataset.originalVisibility;
                }
                // Clear the replaced content
                element.innerHTML = '';
            }
        }
    }

    // Function to block advertisements
    function blockAds() {
        if (!blockingSettings.blockAds) return;
        
        // Find ad elements by various selectors
        const adSelectors = [
            '.adbox',
            '.adboxid', 
            '.auglysing_ticker',
            '[data-zone*="adzone"]',
            '[class*="ad_"]'
        ];
        
        adSelectors.forEach(selector => {
            const adElements = document.querySelectorAll(selector);
            adElements.forEach(element => {
                if (!originalImages.has(element)) {
                    const originalStyle = element.getAttribute('style') || '';
                    originalImages.set(element, originalStyle);
                    
                    // Store original display and visibility
                    const computedStyle = window.getComputedStyle(element);
                    element.dataset.originalDisplay = computedStyle.display;
                    element.dataset.originalVisibility = computedStyle.visibility;
                }
                
                // Replace with plain white block
                element.style.backgroundColor = 'white';
                element.style.border = 'none';
                element.innerHTML = '';
            });
        });
    }

    // Function to process all blocked content images
    function processImages() {
        const anyBlockingEnabled = blockingSettings.block433 || blockingSettings.blockFokus || blockingSettings.blockEyjan || blockingSettings.blockKynning || blockingSettings.blockAds;
        if (!anyBlockingEnabled) return;
        
        // Find all article elements and check their content type
        const articles = document.querySelectorAll('article, .grein, .topbox');
        
        articles.forEach(article => {
            const contentInfo = getContentType(article);
            if (contentInfo.shouldBlock) {
                // Find figures with background images in this article
                const figures = article.querySelectorAll('figure[style*="background-image"]');
                figures.forEach(figure => replaceImageWithBlock(figure, contentInfo.type));
            }
        });

        // Also check any standalone figures
        const allFigures = document.querySelectorAll('figure[style*="background-image"]');
        allFigures.forEach(figure => {
            const parentArticle = figure.closest('article, .grein, .topbox');
            if (parentArticle) {
                const contentInfo = getContentType(parentArticle);
                if (contentInfo.shouldBlock) {
                    replaceImageWithBlock(figure, contentInfo.type);
                }
            }
        });

        // Handle slider content specifically
        processSliderContent();

        // Handle main featured articles with specific selectors (legacy for sports)
        const featuredSportsArticles = document.querySelectorAll('.grein.enskiboltinn figure[style*="background-image"]');
        featuredSportsArticles.forEach(figure => replaceImageWithBlock(figure, '433'));
        
        // Process advertisements
        blockAds();
    }

    // Function to process slider content (topboxes)
    function processSliderContent() {
        // Find all slider containers
        const sliderContainers = document.querySelectorAll('.topboxes, .topboxesnyr');
        
        sliderContainers.forEach(container => {
            // Check each topbox within the slider
            const topboxes = container.querySelectorAll('.topbox');
            
            topboxes.forEach(topbox => {
                // Determine content type based on the URL or content within the topbox
                const contentInfo = determineSliderContentType(topbox);
                
                if (contentInfo.shouldBlock) {
                    const figures = topbox.querySelectorAll('figure[style*="background-image"]');
                    figures.forEach(figure => replaceImageWithBlock(figure, contentInfo.type));
                }
            });
        });
    }

    // Function to determine content type for slider items
    function determineSliderContentType(topbox) {
        // Check for links to specific content sections
        const links = topbox.querySelectorAll('a');
        
        for (let link of links) {
            const href = link.getAttribute('href') || '';
            
            // Check URL patterns to determine content type
            if (href.includes('/433/') || href.includes('enskiboltinn')) {
                return { type: '433', shouldBlock: blockingSettings.block433 };
            }
            if (href.includes('/fokus/')) {
                return { type: 'fokus', shouldBlock: blockingSettings.blockFokus };
            }
            if (href.includes('/eyjan/')) {
                return { type: 'eyjan', shouldBlock: blockingSettings.blockEyjan };
            }
            if (href.includes('/lifsstill/') || href.includes('kynning')) {
                return { type: 'kynning', shouldBlock: blockingSettings.blockKynning };
            }
        }
        
        // If no URL pattern matches, check for category indicators within the content
        const spans = topbox.querySelectorAll('span');
        for (let span of spans) {
            if (span.classList.contains('f_433')) {
                return { type: '433', shouldBlock: blockingSettings.block433 };
            }
            if (span.classList.contains('f_fokus')) {
                return { type: 'fokus', shouldBlock: blockingSettings.blockFokus };
            }
            if (span.classList.contains('f_eyjan')) {
                return { type: 'eyjan', shouldBlock: blockingSettings.blockEyjan };
            }
            if (span.classList.contains('f_lifsstill')) {
                return { type: 'kynning', shouldBlock: blockingSettings.blockKynning };
            }
        }
        
        return { type: null, shouldBlock: false };
    }

    // Function to restore all images and ads
    function restoreAllImages() {
        originalImages.forEach((originalStyle, element) => {
            restoreOriginalImage(element);
        });
    }

    // Function to toggle blocking state (legacy support)
    function toggleBlocking(enabled) {
        blockingSettings = {
            block433: enabled,
            blockFokus: enabled,
            blockEyjan: enabled,
            blockKynning: enabled,
            blockAds: enabled
        };
        
        if (enabled) {
            processImages();
        } else {
            restoreAllImages();
        }
    }

    // Function to update settings
    function updateSettings(settings) {
        blockingSettings = settings;
        
        // Restore all images first
        restoreAllImages();
        
        // Then reprocess based on new settings
        const anyEnabled = settings.block433 || settings.blockFokus || settings.blockEyjan || settings.blockKynning || settings.blockAds;
        if (anyEnabled) {
            processImages();
        }
    }

    // Load initial state from storage
    browser.storage.sync.get(['block433', 'blockFokus', 'blockEyjan', 'blockKynning', 'blockAds', 'blockerEnabled'], function(result) {
        // Handle both new and legacy storage formats
        if (result && (result.block433 !== undefined || result.blockFokus !== undefined || result.blockEyjan !== undefined || result.blockKynning !== undefined || result.blockAds !== undefined)) {
            blockingSettings = {
                block433: result.block433 !== false,
                blockFokus: result.blockFokus !== false,
                blockEyjan: result.blockEyjan !== false,
                blockKynning: result.blockKynning !== false,
                blockAds: result.blockAds !== false
            };
        } else if (result && result.blockerEnabled !== undefined) {
            // Legacy format - convert to new format
            const legacyEnabled = result.blockerEnabled !== false;
            blockingSettings = {
                block433: legacyEnabled,
                blockFokus: legacyEnabled,
                blockEyjan: legacyEnabled,
                blockKynning: legacyEnabled,
                blockAds: legacyEnabled
            };
        } else {
            // No settings found, use defaults
            blockingSettings = {
                block433: true,
                blockFokus: true,
                blockEyjan: true,
                blockKynning: true,
                blockAds: true
            };
        }
        
        const anyEnabled = blockingSettings.block433 || blockingSettings.blockFokus || blockingSettings.blockEyjan || blockingSettings.blockKynning || blockingSettings.blockAds;
        if (anyEnabled) {
            processImages();
        }
    });

    // Listen for messages from popup
    browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'toggleBlocking') {
            toggleBlocking(request.enabled);
        } else if (request.action === 'updateSettings') {
            updateSettings(request.settings);
        }
    });

    // Set up mutation observer for dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        const anyBlockingEnabled = blockingSettings.block433 || blockingSettings.blockFokus || blockingSettings.blockEyjan || blockingSettings.blockKynning || blockingSettings.blockAds;
        if (!anyBlockingEnabled) return;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the new node contains blockable content
                        const contentInfo = getContentType(node);
                        if (contentInfo.shouldBlock) {
                            const figures = node.querySelectorAll('figure[style*="background-image"]');
                            figures.forEach(figure => replaceImageWithBlock(figure, contentInfo.type));
                        }
                        
                        // Also check for figures within the new node
                        const allFigures = node.querySelectorAll('figure[style*="background-image"]');
                        allFigures.forEach(figure => {
                            const parentArticle = figure.closest('article, .grein, .topbox');
                            if (parentArticle) {
                                const parentContentInfo = getContentType(parentArticle);
                                if (parentContentInfo.shouldBlock) {
                                    replaceImageWithBlock(figure, parentContentInfo.type);
                                }
                            }
                        });
                        
                        // Check if the new node is a slider element or contains slider content
                        if (node.classList && (node.classList.contains('topboxes') || node.classList.contains('topbox') || node.querySelector('.topbox'))) {
                            // Process slider content specifically for this new node
                            const topboxes = node.classList.contains('topbox') ? [node] : node.querySelectorAll('.topbox');
                            topboxes.forEach(topbox => {
                                const contentInfo = determineSliderContentType(topbox);
                                if (contentInfo.shouldBlock) {
                                    const figures = topbox.querySelectorAll('figure[style*="background-image"]');
                                    figures.forEach(figure => replaceImageWithBlock(figure, contentInfo.type));
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Additional check after page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const anyEnabled = blockingSettings.block433 || blockingSettings.blockFokus || blockingSettings.blockEyjan || blockingSettings.blockKynning || blockingSettings.blockAds;
            if (anyEnabled) processImages();
        });
    }
    
    window.addEventListener('load', function() {
        const anyEnabled = blockingSettings.block433 || blockingSettings.blockFokus || blockingSettings.blockEyjan || blockingSettings.blockKynning || blockingSettings.blockAds;
        if (anyEnabled) processImages();
    });

    console.log('DV Content Blocker: Extension loaded and monitoring for 433, Fókus, Eyjan, Kynning, and Ad content');
})();