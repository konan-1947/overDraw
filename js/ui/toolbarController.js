/**
 * @fileoverview Handles events and updates for the toolbar UI.
 */
import { getState, updateState } from '../core/state.js';
import { clearDrawingArea, getContext, getCanvas, resizeCanvas } from '../canvas/canvasContext.js';
import { undoLastAction, redoLastAction, resetUndoRedoHistory } from '../canvas/undoRedo.js';
import { setCurrentTool, deactivateTextToolIfNeeded } from '../tools/toolManager.js';
import { TOOLBAR_ID, BOARD_ID } from '../core/constants.js';

let toolbarElement = null;
let boardElementRef = null; // Reference to the board element for minimize functionality

/**
 * Initializes the toolbar event listeners.
 */
export function initializeToolbar() {
    toolbarElement = document.getElementById(TOOLBAR_ID);
    boardElementRef = document.getElementById(BOARD_ID); // Get board reference

    if (!toolbarElement || !boardElementRef) {
        console.error('Toolbar or Board element not found for initialization.');
        return;
    }

    // Tool selection
    toolbarElement.addEventListener('click', (event) => {
        try {
            const button = event.target.closest('button[data-tool]');
            if (button && button.dataset.tool) {
                deactivateTextToolIfNeeded(); // Ensure text tool is finalized before switching
                setCurrentTool(button.dataset.tool);
            }
        } catch (err) {
            console.error('Error handling toolbar click:', err);
        }
    });

    // Color picker
    const colorPicker = toolbarElement.querySelector('#overdraw-color-picker');
    if (colorPicker) {
        colorPicker.addEventListener('input', handleColorChange);
        colorPicker.addEventListener('change', handleColorChangeFinal);
    }

    // Brush size slider
    const brushSizeSlider = toolbarElement.querySelector('#overdraw-brush-size');
    const brushSizeValueDisplay = toolbarElement.querySelector('#overdraw-brush-size-value');
    if (brushSizeSlider && brushSizeValueDisplay) {
        brushSizeSlider.addEventListener('input', (event) => {
            const newSize = parseInt(event.target.value, 10);
            updateState({ currentBrushSize: newSize });
            brushSizeValueDisplay.textContent = `${newSize}px`;
            const ctx = getContext();
            if (ctx) ctx.lineWidth = newSize;
        });
    }

    // Text size slider
    const textSizeSlider = toolbarElement.querySelector('#overdraw-text-size');
    const textSizeValueDisplay = toolbarElement.querySelector('#overdraw-text-size-value');
    if (textSizeSlider && textSizeValueDisplay) {
        textSizeSlider.addEventListener('input', (event) => {
            const newSize = parseInt(event.target.value, 10);
            updateState({ currentTextSize: newSize });
            textSizeValueDisplay.textContent = `${newSize}px`;
            const ctx = getContext();
            if (ctx) ctx.font = `${newSize}px ${getState().currentFont}`;
        });
    }

    // Clear button
    const clearButton = toolbarElement.querySelector('#overdraw-clear');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                clearDrawingArea();
                resetUndoRedoHistory(getCanvas());
            }
        });
    }

    // Undo button
    const undoButton = toolbarElement.querySelector('#overdraw-undo');
    if (undoButton) {
        undoButton.addEventListener('click', () => undoLastAction(getCanvas(), getContext()));
    }

    // Redo button
    const redoButton = toolbarElement.querySelector('#overdraw-redo');
    if (redoButton) {
        redoButton.addEventListener('click', () => redoLastAction(getCanvas(), getContext()));
    }

    // Minimize/Expand button
    const minimizeButton = toolbarElement.querySelector('#overdraw-minimize');
    if (minimizeButton) {
        minimizeButton.addEventListener('click', toggleBoardMinimize);
    }
    console.log('Toolbar initialized and events bound.');
}

/**
 * Handles changes from the color picker.
 */
function handleColorChange(event) {
    const newColor = event.target.value;
    updateState({ currentColor: newColor });
    const ctx = getContext();
    if (ctx) {
        ctx.strokeStyle = newColor;
        ctx.fillStyle = newColor;
    }
}

/**
 * Handles the final color selection.
 */
function handleColorChangeFinal(event) {
    handleColorChange(event);
    console.log("Final color selected:", event.target.value);
}

/**
 * Toggles the minimized state of the drawing board and parts of the toolbar.
 */
function toggleBoardMinimize() {
    try {
        const state = getState();
        const isMinimized = !state.isToolbarMinimized; // Toggle the state
        updateState({ isToolbarMinimized: isMinimized });

        const minimizeButton = toolbarElement.querySelector('#overdraw-minimize');

        if (isMinimized) {
            boardElementRef.style.display = 'none'; // Hide the canvas board
            // Hide specific tool groups, keep essential controls like minimize
            toolbarElement.querySelectorAll('.tool-group').forEach(group => group.style.display = 'none');
            if (minimizeButton) minimizeButton.innerHTML = '=>';
            document.documentElement.style.overflow = ''; // Allow page scrolling
            updateState({ isBoardActive: false }); // Board is not actively usable when minimized
            deactivateTextToolIfNeeded(); // Remove any active text input when minimizing
        } else {
            boardElementRef.style.display = 'block'; // Show the canvas board
            resizeCanvas(); // Ensure canvas is correctly sized after display block
            toolbarElement.querySelectorAll('.tool-group').forEach(group => group.style.display = 'flex');
            if (minimizeButton) minimizeButton.innerHTML = '<=';
            document.documentElement.style.overflow = 'hidden'; // Prevent page scrolling
            updateState({ isBoardActive: true }); // Board is active again
        }
        console.log(`Board minimized: ${isMinimized}`);
    } catch (err) {
        console.error('Error in toggleBoardMinimize:', err);
    }
}


/**
 * Shows or hides the entire toolbar based on overall extension enabled state.
 * @param {boolean} show - True to show, false to hide.
 */
export function setOverallToolbarVisibility(show) {
    if (toolbarElement) {
        if (show) {
            toolbarElement.style.display = 'flex'; // Use flex as per CSS
        } else {
            toolbarElement.style.display = 'none';
        }
    }
}

/**
 * Resets the toolbar to its default (non-minimized) visual state.
 * Called when the extension is enabled via F9.
 */
export function resetToolbarToDefaultState() {
    updateState({ isToolbarMinimized: false }); // Ensure state is not minimized
    if (toolbarElement) {
        const minimizeButton = toolbarElement.querySelector('#overdraw-minimize');
        if (minimizeButton) minimizeButton.innerHTML = '<=';
        toolbarElement.querySelectorAll('.tool-group').forEach(group => group.style.display = 'flex');
    }
}