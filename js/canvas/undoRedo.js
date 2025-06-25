/**
 * @fileoverview Manages undo and redo functionality for the canvas.
 */

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_STATES = 30; // Limit history size

/**
 * Records the current state of the canvas for undo.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
export function recordCanvasState(canvas) {
    if (!canvas) return;
    if (undoStack.length >= MAX_HISTORY_STATES) {
        undoStack.shift(); // Remove the oldest state
    }
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack on new action
    updateUndoRedoButtonStates();
}

/**
 * Undoes the last action on the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 */
export function undoLastAction(canvas, ctx) {
    if (undoStack.length <= 1) return; // Need at least one state to revert to (initial is often blank)

    const lastState = undoStack.pop();
    if (lastState) redoStack.push(lastState);

    const prevStateDataUrl = undoStack[undoStack.length - 1];
    if (prevStateDataUrl) {
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = prevStateDataUrl;
    }
    updateUndoRedoButtonStates();
}

/**
 * Redoes the last undone action on the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 */
export function redoLastAction(canvas, ctx) {
    if (redoStack.length === 0) return;

    const nextStateDataUrl = redoStack.pop();
    if (nextStateDataUrl) {
        undoStack.push(nextStateDataUrl);
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = nextStateDataUrl;
    }
    updateUndoRedoButtonStates();
}

/**
 * Resets the undo/redo history.
 * @param {HTMLCanvasElement} canvas - The canvas element (to record initial blank state).
 */
export function resetUndoRedoHistory(canvas) {
    undoStack = [];
    redoStack = [];
    if (canvas) { // Record initial blank state
        setTimeout(() => recordCanvasState(canvas), 0); // Allow canvas to render
    }
    updateUndoRedoButtonStates();
}


/**
 * Updates the disabled state of undo/redo buttons based on stack lengths.
 */
function updateUndoRedoButtonStates() {
    const undoButton = document.getElementById('overdraw-undo');
    const redoButton = document.getElementById('overdraw-redo');

    if (undoButton) {
        undoButton.disabled = undoStack.length <= 1;
    }
    if (redoButton) {
        redoButton.disabled = redoStack.length === 0;
    }
}