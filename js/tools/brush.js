/**
 * @fileoverview Logic for the Brush drawing tool.
 */
import { getContext } from '../canvas/canvasContext.js';
import { getState } from '../core/state.js';

/**
 * Draws a line segment using the brush tool.
 * @param {number} x1 - Starting X coordinate.
 * @param {number} y1 - Starting Y coordinate.
 * @param {number} x2 - Ending X coordinate.
 * @param {number} y2 - Ending Y coordinate.
 */
export function drawWithBrush(x1, y1, x2, y2) {
    const ctx = getContext();
    const state = getState();
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over'; // Normal drawing mode
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentBrushSize;

    // If x1,y1 are same as x2,y2, draw a small circle (dot)
    if (x1 === x2 && y1 === y2) {
        ctx.beginPath(); // Start a new path for the dot
        ctx.arc(x1, y1, state.currentBrushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = state.currentColor; // Use fill for a solid dot
        ctx.fill();
    } else {
        // For continuous drawing, ensure beginPath was called by inputHandler
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}