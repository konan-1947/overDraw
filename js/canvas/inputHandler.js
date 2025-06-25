/**
 * @fileoverview Handles mouse and touch input events on the canvas.
 */
import { getState, updateState, resetDrawingState } from '../core/state.js';
import { getContext, getCanvas } from './canvasContext.js';
import { applyCurrentTool, deactivateTextToolIfNeeded } from '../tools/toolManager.js';
import { TOOL_TEXT } from '../core/constants.js';
import { recordCanvasState } from './undoRedo.js';

let ongoingTouches = []; // To store active touch points

/**
 * Copies relevant properties from a Touch object.
 * @param {Touch} touch - The original Touch object.
 * @returns {{identifier: number, pageX: number, pageY: number, clientX: number, clientY: number}} A simplified touch object.
 */
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, clientX: touch.clientX, clientY: touch.clientY };
}

/**
 * Finds the index of an ongoing touch by its identifier.
 * @param {number} idToFind - The identifier of the touch to find.
 * @returns {number} The index of the touch, or -1 if not found.
 */
function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
        if (ongoingTouches[i].identifier === idToFind) {
            return i;
        }
    }
    return -1; // not found
}


/**
 * Gets the mouse position relative to the canvas.
 * @param {MouseEvent} event - The mouse event.
 * @returns {{x: number, y: number}} The x and y coordinates.
 */
function getMousePosition(event) {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

/**
 * Handles the mousedown event on the canvas.
 * @param {MouseEvent} event - The mousedown event.
 */
export function handleMouseDown(event) {
    if (event.button !== 0) return; // Only main (left) click

    // deactivateTextToolIfNeeded(); // Temporarily disabled for debugging

    const { x, y } = getMousePosition(event);
    const state = getState();
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

/**
 * Handles the mousemove event on the canvas.
 * @param {MouseEvent} event - The mousemove event.
 */
export function handleMouseMove(event) {
    const state = getState();
    if (!state.isDrawing || state.currentTool === TOOL_TEXT) return;

    const { x, y } = getMousePosition(event);
    applyCurrentTool(state.lastX, state.lastY, x, y);
    updateState({ lastX: x, lastY: y });
}

/**
 * Handles the mouseup event on the canvas.
 */
export function handleMouseUp() {
    const state = getState();
    if (state.isDrawing && state.currentTool !== TOOL_TEXT) {
        recordCanvasState(getCanvas());
    }
    resetDrawingState();
}

/**
 * Handles the touchstart event on the canvas.
 * @param {TouchEvent} event - The touchstart event.
 */
export function handleTouchStart(event) {
    event.preventDefault(); // Prevent default touch actions (scrolling, zooming)
    deactivateTextToolIfNeeded();

    const touches = event.changedTouches;
    const canvas = getCanvas();
    const ctx = getContext();
    const state = getState();
    if (!canvas || !ctx) return;

    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        const rect = canvas.getBoundingClientRect();
        const x = touches[i].clientX - rect.left;
        const y = touches[i].clientY - rect.top;

        if (state.currentTool !== TOOL_TEXT) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            applyCurrentTool(x, y, x, y); // Draw a dot
        } else {
            applyCurrentTool(x, y); // Text tool handles its own placement
        }
    }
    updateState({ isDrawing: true }); // General drawing flag
}

/**
 * Handles the touchmove event on the canvas.
 * @param {TouchEvent} event - The touchmove event.
 */
export function handleTouchMove(event) {
    event.preventDefault();
    const state = getState();
    if (!state.isDrawing || state.currentTool === TOOL_TEXT) return;

    const touches = event.changedTouches;
    const canvas = getCanvas();
    const ctx = getContext();
    if (!canvas || !ctx) return;

    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const idx = ongoingTouchIndexById(touch.identifier);

        if (idx >= 0) {
            const rect = canvas.getBoundingClientRect();
            const prevX = ongoingTouches[idx].clientX - rect.left;
            const prevY = ongoingTouches[idx].clientY - rect.top;
            const currentX = touch.clientX - rect.left;
            const currentY = touch.clientY - rect.top;

            applyCurrentTool(prevX, prevY, currentX, currentY);
            ongoingTouches.splice(idx, 1, copyTouch(touch)); // Update touch
        }
    }
}

/**
 * Handles the touchend or touchcancel event on the canvas.
 * @param {TouchEvent} event - The touchend or touchcancel event.
 */
export function handleTouchEnd(event) {
    event.preventDefault();
    const touches = event.changedTouches;
    const state = getState();

    for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1); // Remove from active touches
        }
    }

    if (ongoingTouches.length === 0) { // All fingers lifted
        if (state.isDrawing && state.currentTool !== TOOL_TEXT) {
            recordCanvasState(getCanvas());
        }
        resetDrawingState();
    }
}