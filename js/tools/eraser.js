/**
 * @fileoverview Logic for the Eraser tool.
 */
import { getContext } from '../canvas/canvasContext.js';
import { getState } from '../core/state.js';

/**
 * Erases a line segment on the canvas.
 * @param {number} x1 - Starting X coordinate.
 * @param {number} y1 - Starting Y coordinate.
 * @param {number} x2 - Ending X coordinate.
 * @param {number} y2 - Ending Y coordinate.
 */
export function eraseArea(x1, y1, x2, y2) {
    const ctx = getContext();
    const state = getState();
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out'; // Erasing mode
    ctx.lineWidth = state.currentBrushSize; // Eraser size uses brush size

    // If x1,y1 are same as x2,y2, erase a small circle (dot)
    if (x1 === x2 && y1 === y2) {
        ctx.beginPath(); // Start a new path for the dot
        ctx.arc(x1, y1, state.currentBrushSize / 2, 0, Math.PI * 2);
        ctx.fill(); // Fill with transparency in destination-out mode
    } else {
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}