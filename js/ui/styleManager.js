/**
 * @fileoverview Manages the injection of CSS styles into the page.
 * This is technically handled by manifest.json for css files,
 * but if you needed to inject dynamic styles, this would be the place.
 * For now, it's a placeholder or could be used for dynamic style element creation if needed.
 */

/**
 * Injects a <link> element for the main CSS file if not already handled by manifest.
 * (Note: manifest.json's "css" field is usually preferred for static CSS)
 */
export function ensureStylesInjected() {
    const CSS_LINK_ID = 'overdraw-main-styles';
    if (document.getElementById(CSS_LINK_ID)) {
        return; // Styles already injected
    }

    // This part is mostly illustrative as manifest.json handles CSS injection.
    // However, if you had a reason to do it programmatically:
    // const link = document.createElement('link');
    // link.id = CSS_LINK_ID;
    // link.rel = 'stylesheet';
    // link.type = 'text/css';
    // link.href = chrome.runtime.getURL('css/styles.css');
    // (document.head || document.documentElement).appendChild(link);
    // console.log('OverDraw styles programmatically linked (illustrative).');
}