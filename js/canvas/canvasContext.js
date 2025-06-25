/**
 * @fileoverview Manages the canvas element and its 2D rendering context.
 */
import { CANVAS_ID } from '../core/constants.js';
import { updateState, getState } from '../core/state.js';

let canvas = null;
let ctx = null;

/**
 * Initializes the canvas and its 2D context.
 * Sets initial drawing properties.
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} | null}
 */
export function initializeCanvas() {
    canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
        console.error('Canvas element not found!');
        return null;
    }
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        console.error('Failed to get 2D context from canvas!');
        return null;
    }

    // Set initial canvas dimensions based on the board/window
    const boardElement = canvas.parentElement;
    if (boardElement) {
        canvas.width = boardElement.clientWidth;
        canvas.height = boardElement.clientHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }


    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Initial state set by state.js, but ensure ctx reflects it
    updateState({});
    const state = getState();
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentBrushSize;
    ctx.fillStyle = state.currentColor; // For text and fill operations
    ctx.font = `${state.currentTextSize}px ${state.currentFont}`;


    console.log('Canvas initialized');
    return { canvas, ctx };
}

/**
 * Gets the current canvas element.
 * @returns {HTMLCanvasElement | null}
 */
export function getCanvas() {
    return canvas;
}

/**
 * Gets the current 2D rendering context.
 * @returns {CanvasRenderingContext2D | null}
 */
export function getContext() {
    return ctx;
}

/**
 * Clears the entire canvas.
 */
export function clearDrawingArea() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error('Context or Canvas not available for clearing.');
    }
}

/**
 * Resizes the canvas, attempting to preserve its content.
 */
export function resizeCanvas() {
    if (!canvas || !ctx) return;

    const boardElement = canvas.parentElement;
    if (!boardElement) return;

    // Save current content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = boardElement.clientWidth;
    canvas.height = boardElement.clientHeight;

    // Restore content
    ctx.putImageData(imageData, 0, 0);

    // Re-apply drawing styles as context might reset
    updateState({});
    const state = getState();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentBrushSize;
    ctx.fillStyle = state.currentColor;
    ctx.font = `${state.currentTextSize}px ${state.currentFont}`;
}