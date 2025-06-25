/**
 * @fileoverview Manages the global state of the drawing application.
 */
import { DEFAULT_COLOR, DEFAULT_BRUSH_SIZE, TOOL_BRUSH, DEFAULT_TEXT_SIZE, DEFAULT_FONT } from './constants.js';

let appState = {
    isExtensionEnabled: false, // Overall F9 enable/disable state
    isBoardActive: false,     // Tracks if the board elements are currently visible and interactive (after F9 enable and not minimized)
    isToolbarMinimized: false,
    currentTool: TOOL_BRUSH,
    currentColor: DEFAULT_COLOR,
    currentBrushSize: DEFAULT_BRUSH_SIZE,
    currentTextSize: DEFAULT_TEXT_SIZE,
    currentFont: DEFAULT_FONT,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    activeTouches: [],
};

/**
 * Gets the current application state.
 * @returns {object} The current state.
 */
export function getState() {
    return appState;
}

/**
 * Updates one or more properties of the application state.
 * @param {object} newStateProperties - An object with properties to update.
 */
export function updateState(newStateProperties) {
    appState = { ...appState, ...newStateProperties };
    // console.log('State updated:', appState); // For debugging
}

/**
 * Resets drawing-related state (e.g., when mouse/touch up).
 */
export function resetDrawingState() {
    updateState({ isDrawing: false, activeTouches: [] });
}