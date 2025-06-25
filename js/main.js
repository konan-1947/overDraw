/**
 * @fileoverview Main entry point for the OverDraw Enhanced extension.
 * Initializes and coordinates all modules.
 */

// Core
import { getState, updateState } from './core/state.js';
import { TOOL_BRUSH, BOARD_ID, TOOLBAR_ID } from './core/constants.js';

// UI
// import { ensureStylesInjected } from './ui/styleManager.js'; // Not strictly needed with manifest CSS
import { createBoardElement, createToolbarElement } from './ui/domElements.js';
import { initializeToolbar, setOverallToolbarVisibility, resetToolbarToDefaultState } from './ui/toolbarController.js';
import { checkAndShowFirstRunGuide } from './ui/firstRunGuide.js';

// Canvas
import { initializeCanvas, clearDrawingArea, getCanvas, resizeCanvas } from './canvas/canvasContext.js';
import { bindCanvasEvents, unbindCanvasEvents } from './canvas/eventBinder.js';
import { resetUndoRedoHistory } from './canvas/undoRedo.js';

// Tools
import { setCurrentTool, deactivateTextToolIfNeeded } from './tools/toolManager.js';

let boardElement = null; // Direct reference to the board div
let toolbarElement = null; // Direct reference to the toolbar div

/**
 * Enables the drawing board extension (called by F9).
 * This makes the toolbar visible and prepares the board.
 */
function enableExtension() {
    if (getState().isExtensionEnabled) return;

    boardElement = document.getElementById(BOARD_ID);
    toolbarElement = document.getElementById(TOOLBAR_ID);

    if (!boardElement || !toolbarElement) {
        console.error("Board or Toolbar element not found during enableExtension");
        return;
    }

    // Initial setup from main2.js enable()
    toolbarElement.style.display = 'flex'; // Use 'flex' as per our CSS for the toolbar
    boardElement.style.zIndex = '9999990'; // High z-index for board
    boardElement.style.top = '0';
    boardElement.style.display = 'block'; // Ensure board (canvas container) is visible

    document.documentElement.style.overflow = 'hidden'; // Prevent page scrolling

    updateState({ isExtensionEnabled: true, isBoardActive: true, isToolbarMinimized: false }); // Board active by default on enable
    resetToolbarToDefaultState(); // Ensure toolbar is not in minimized visual state

    const canvasData = initializeCanvas(); // Initialize canvas context, size, etc.
    if (canvasData) {
        bindCanvasEvents();
        resetUndoRedoHistory(canvasData.canvas);
        setCurrentTool(TOOL_BRUSH);
        resizeCanvas(); // Ensure canvas is sized correctly
    }

    checkAndShowFirstRunGuide();
    console.log('OverDraw extension enabled.');
}

/**
 * Disables the drawing board extension (called by F9).
 * This hides everything and cleans up.
 */
function disableExtension() {
    if (!getState().isExtensionEnabled) return;

    deactivateTextToolIfNeeded(); // Finalize any active text input

    if (boardElement && toolbarElement) {
        // From main2.js disable()
        toolbarElement.style.display = 'none';
        boardElement.style.zIndex = '-99999'; // Send board behind
        boardElement.style.top = '-200vh';    // Move board out of view
        // boardElement.style.display = 'block'; // Or 'none' if preferred when fully disabled
    }

    unbindCanvasEvents();
    document.documentElement.style.overflow = ''; // Restore page scrolling
    updateState({ isExtensionEnabled: false, isBoardActive: false });
    console.log('OverDraw extension disabled.');
}


/**
 * Handles the F9 key press to toggle the board.
 * @param {KeyboardEvent} event
 */
function handleGlobalKeyDown(event) {
    if (event.key === 'F9') {
        event.preventDefault();
        const state = getState();
        if (!state.isExtensionEnabled) { // If extension is completely off
            if (confirm('Enable OverDraw board?')) {
                enableExtension();
            }
        } else { // If extension is on (could be minimized or active)
            if (confirm('Disable OverDraw board?')) {
                disableExtension();
            }
        }
    } else if (getState().isBoardActive) { // Shortcuts only if board is actively usable
        if (event.ctrlKey && event.key === 'z') { // Ctrl+Z for Undo
            event.preventDefault();
            const undoButton = document.getElementById('overdraw-undo');
            if (undoButton && !undoButton.disabled) undoButton.click();
        } else if (event.ctrlKey && event.key === 'y') { // Ctrl+Y for Redo
            event.preventDefault();
            const redoButton = document.getElementById('overdraw-redo');
            if (redoButton && !redoButton.disabled) redoButton.click();
        }
    }
}


/**
 * Initializes the entire extension.
 * Creates DOM elements, sets up initial state.
 */
function initializeExtensionFramework() {
    console.log('Initializing OverDraw Enhanced Framework...');
    // ensureStylesInjected(); // CSS handled by manifest

    // Create DOM elements once
    boardElement = createBoardElement();
    toolbarElement = createToolbarElement();

    initializeToolbar(); // Setup toolbar event listeners and logic

    document.addEventListener('keydown', handleGlobalKeyDown);

    console.log('OverDraw Enhanced framework initialized. Press F9 to toggle.');
}

// --- Start the extension ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtensionFramework);
} else {
    initializeExtensionFramework();
}