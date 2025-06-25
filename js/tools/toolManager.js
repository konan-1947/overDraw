/**
 * @fileoverview Manages the currently active drawing tool and delegates actions.
 */
import { getState, updateState } from '../core/state.js';
import { getContext, getCanvas } from '../canvas/canvasContext.js';
import { TOOL_BRUSH, TOOL_ERASER, TOOL_TEXT, TEXT_INPUT_ID } from '../core/constants.js';
import { drawWithBrush } from './brush.js';
import { eraseArea } from './eraser.js';
import { activateTextMode, deactivateTextMode } from './textTool.js';

let justCreated = false;

/**
 * Sets the current drawing tool.
 * @param {string} toolName - The name of the tool (e.g., TOOL_BRUSH).
 */
export function setCurrentTool(toolName) {
    deactivateTextToolIfNeeded(); // Deactivate text tool if switching away from it

    updateState({ currentTool: toolName });
    console.log(`Tool changed to: ${toolName}`);

    // Update cursor style
    const canvas = getCanvas();
    if (canvas) {
        switch (toolName) {
            case TOOL_BRUSH:
            case TOOL_ERASER: // Eraser can also use crosshair or a custom eraser cursor
                canvas.style.cursor = 'crosshair';
                break;
            case TOOL_TEXT:
                canvas.style.cursor = 'text';
                break;
            default:
                canvas.style.cursor = 'default';
        }
    }
    updateActiveToolButton(toolName);
}

/**
 * Applies the current tool's drawing logic.
 * @param {number} x1 - Starting X (or click X for text).
 * @param {number} y1 - Starting Y (or click Y for text).
 * @param {number} [x2] - Ending X (for line tools).
 * @param {number} [y2] - Ending Y (for line tools).
 */
export function applyCurrentTool(x1, y1, x2, y2) {
    const state = getState();
    switch (state.currentTool) {
        case TOOL_BRUSH:
            drawWithBrush(x1, y1, x2, y2);
            break;
        case TOOL_ERASER:
            eraseArea(x1, y1, x2, y2);
            break;
        case TOOL_TEXT:
            // For text tool, x1, y1 are the click coordinates to place the input
            activateTextMode(x1, y1);
            break;
    }
}

/**
 * Deactivates the text tool if it's currently active and value needs to be placed or discarded.
 */
export function deactivateTextToolIfNeeded() {
    const state = getState();
    if (state.currentTool === TOOL_TEXT) {
        // The textTool's internal blur/enter handlers should manage placement.
        // This function is more a safeguard or for explicit deactivation.
        // It might be better to let textTool manage its own lifecycle fully.
        // For now, let's assume if we are starting a new action (like mousedown for brush)
        // the text tool should finalize.
        const textInputElement = document.getElementById(TEXT_INPUT_ID);
        if (textInputElement && document.activeElement === textInputElement) {
            textInputElement.blur(); // This will trigger placeTextOnCanvas or deactivateTextMode
        } else if (textInputElement) {
            deactivateTextMode(false); // If not focused, just remove it
        }
    }
}

/**
 * Updates the visual state of tool buttons in the toolbar.
 * @param {string} activeToolName - The name of the currently active tool.
 */
function updateActiveToolButton(activeToolName) {
    const toolbar = document.getElementById('overdraw-toolbar');
    if (!toolbar) return;

    const toolButtons = toolbar.querySelectorAll('button[data-tool]');
    toolButtons.forEach(button => {
        if (button.dataset.tool === activeToolName) {
            button.classList.add('active-tool');
        } else {
            button.classList.remove('active-tool');
        }
    });
}

export function handleMouseDown(event) {
    if (event.button !== 0) return; // Only main (left) click

    const state = getState();

    // Only deactivate text tool if switching away from it
    if (state.currentTool !== TOOL_TEXT) {
        deactivateTextToolIfNeeded();
    }

    const { x, y } = getMousePosition(event);
    const ctx = getContext();

    updateState({ isDrawing: true, lastX: x, lastY: y });

    if (state.currentTool !== TOOL_TEXT) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        // For tools like brush/eraser, apply might draw a dot on click
        applyCurrentTool(x, y, x, y); // Draw a dot if tool supports it
    } else {
        // Text tool handles its own click logic via toolManager
        applyCurrentTool(x, y);
    }
}

function handleTextInputBlur() {
    if (justCreated) {
        justCreated = false;
        textInputElement.focus();
        return;
    }
    placeTextOnCanvas();
}