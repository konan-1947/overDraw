/**
 * @fileoverview Manages the display of a first-run guide modal.
 */
import { getStorage, setStorage } from '../utils/storage.js';
import { GUIDE_MODAL_ID, STORAGE_KEY_GUIDE_SEEN } from '../core/constants.js';

let guideModalElement = null;

/**
 * Creates the DOM for the first-run guide modal if it doesn't exist.
 */
function createGuideModalDOM() {
    if (document.getElementById(GUIDE_MODAL_ID)) {
        guideModalElement = document.getElementById(GUIDE_MODAL_ID);
        return;
    }

    guideModalElement = document.createElement('div');
    guideModalElement.id = GUIDE_MODAL_ID;
    guideModalElement.innerHTML = `
        <h3>Welcome to OverDraw Enhanced!</h3>
        <p>Here are some quick tips to get you started:</p>
        <ul>
            <li>Press <strong>F9</strong> to toggle the drawing board on and off.</li>
            <li>Use the toolbar to select tools (Brush, Eraser, Text).</li>
            <li>Adjust color and brush/text size using the controls.</li>
            <li>Undo/Redo your actions with the arrow buttons.</li>
            <li>Clear the canvas with the trash icon.</li>
        </ul>
        <button id="overdraw-guide-close">Got it!</button>
    `;
    document.body.appendChild(guideModalElement);

    const closeButton = guideModalElement.querySelector('#overdraw-guide-close');
    if (closeButton) {
        closeButton.addEventListener('click', hideGuideModal);
    }
}

/**
 * Shows the first-run guide modal.
 */
function showGuideModal() {
    if (!guideModalElement) createGuideModalDOM();
    if (guideModalElement) {
        guideModalElement.style.display = 'block';
    }
}

/**
 * Hides the first-run guide modal and marks it as seen.
 */
function hideGuideModal() {
    if (guideModalElement) {
        guideModalElement.style.display = 'none';
    }
    setStorage(STORAGE_KEY_GUIDE_SEEN, true);
}

/**
 * Checks if the guide has been seen and shows it if not.
 * Should be called when the drawing board is first enabled.
 */
export async function checkAndShowFirstRunGuide() {
    const hasSeenGuide = await getStorage(STORAGE_KEY_GUIDE_SEEN);
    if (!hasSeenGuide) {
        showGuideModal();
    }
}