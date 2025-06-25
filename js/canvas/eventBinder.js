/**
 * @fileoverview Binds event listeners to the canvas element.
 */
import { getCanvas } from './canvasContext.js';
import { handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } from './inputHandler.js';
import { resizeCanvas } from './canvasContext.js';

/**
 * Attaches all necessary event listeners to the canvas.
 */
export function bindCanvasEvents() {
    const canvas = getCanvas();
    if (!canvas) {
        console.error("Canvas not found for event binding.");
        return;
    }

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp); // Treat leaving canvas as mouseup

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false }); // Treat cancel as end

    // Window resize event
    window.addEventListener('resize', resizeCanvas);
    console.log('Canvas events bound.');
}

/**
 * Removes all event listeners from the canvas.
 */
export function unbindCanvasEvents() {
    const canvas = getCanvas();
    if (!canvas) return;

    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('mouseleave', handleMouseUp);

    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);

    window.removeEventListener('resize', resizeCanvas);
    console.log('Canvas events unbound.');
}