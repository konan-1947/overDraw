/**
 * @fileoverview Logic for the Text drawing tool.
 */
import { getContext, getCanvas } from '../canvas/canvasContext.js';
import { getState, updateState } from '../core/state.js';
import { TEXT_INPUT_ID } from '../core/constants.js';
import { recordCanvasState } from '../canvas/undoRedo.js';

let textInputElement = null;
let textInputCallback = null; // To call after text is placed

/**
 * Activates the text tool, preparing for user input.
 * @param {number} initialX - The X coordinate where the text tool was activated (click position).
 * @param {number} initialY - The Y coordinate where the text tool was activated.
 */
export function activateTextMode(initialX, initialY) {
    try {
        const canvas = getCanvas();
        if (!canvas) throw new Error("Canvas not found in activateTextMode");

        if (textInputElement) {
            deactivateTextMode(false);
        }

        textInputElement = document.createElement('textarea');
        textInputElement.id = TEXT_INPUT_ID;
        textInputElement.style.position = 'fixed';

        textInputElement.style.left = `${initialX}px`;
        textInputElement.style.top = `${initialY}px`;

        const state = getState();
        textInputElement.style.fontSize = `${state.currentTextSize}px`;
        textInputElement.style.fontFamily = state.currentFont;
        textInputElement.style.color = state.currentColor;
        textInputElement.style.lineHeight = `${state.currentTextSize * 1.2}px`;
        textInputElement.style.minWidth = '50px';
        textInputElement.style.minHeight = `${state.currentTextSize * 1.2}px`;
        textInputElement.value = '';

        document.body.appendChild(textInputElement);
        textInputElement.focus();

        // Restore only the keydown handler
        // textInputElement.addEventListener('blur', handleTextInputBlur);
        textInputElement.addEventListener('keydown', handleTextInputKeyDown);
        console.log("Text tool activated at", initialX, initialY);
    } catch (err) {
        console.error("Error in activateTextMode:", err);
    }
}

/**
 * Handles the blur event from the text input field.
 */
function handleTextInputBlur() {
    placeTextOnCanvas();
}

/**
 * Handles keydown events in the text input field (e.g., Enter).
 * @param {KeyboardEvent} event
 */
function handleTextInputKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) { // Enter to confirm, Shift+Enter for newline
        event.preventDefault(); // Prevent new line in textarea
        placeTextOnCanvas();
    } else if (event.key === 'Escape') {
        deactivateTextMode(false); // Cancel text input
    }
}

/**
 * Places the text from the input field onto the canvas.
 */
function placeTextOnCanvas() {
    try {
        if (!textInputElement || !textInputElement.value.trim()) {
            deactivateTextMode(false);
            return;
        }

        const ctx = getContext();
        const canvas = getCanvas();
        const state = getState();
        if (!ctx || !canvas) throw new Error("Canvas or context not found in placeTextOnCanvas");

        const text = textInputElement.value;
        const x = parseFloat(textInputElement.style.left);
        const y = parseFloat(textInputElement.style.top);

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = state.currentColor;
        ctx.font = `${state.currentTextSize}px ${state.currentFont}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        const lines = text.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * state.currentTextSize * 1.2));
        });

        recordCanvasState(canvas);
        deactivateTextMode(true);
    } catch (err) {
        console.error("Error in placeTextOnCanvas:", err);
    }
}


/**
 * Deactivates the text tool and removes the input element.
 * @param {boolean} textWasPlaced - Whether text was actually drawn on the canvas.
 */
export function deactivateTextMode(textWasPlaced) {
    try {
        if (textInputElement) {
            // textInputElement.removeEventListener('blur', handleTextInputBlur);
            // textInputElement.removeEventListener('keydown', handleTextInputKeyDown);
            textInputElement.remove();
            textInputElement = null;
            console.log("Text tool deactivated.");
        }
    } catch (err) {
        console.error("Error in deactivateTextMode:", err);
    }
}