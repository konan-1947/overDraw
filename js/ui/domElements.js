/**
 * @fileoverview Functions to create the main DOM elements for the extension.
 */
import { BOARD_ID, CANVAS_ID, TOOLBAR_ID, DEFAULT_COLOR, DEFAULT_BRUSH_SIZE, TOOL_BRUSH, TOOL_ERASER, TOOL_TEXT, DEFAULT_TEXT_SIZE } from '../core/constants.js';

/**
 * Creates the drawing board (canvas container) and appends it to the body.
 * @returns {HTMLElement} The created board element.
 */
export function createBoardElement() {
    let board = document.getElementById(BOARD_ID);
    if (board) return board;

    board = document.createElement('div');
    board.id = BOARD_ID;

    const canvas = document.createElement('canvas');
    canvas.id = CANVAS_ID;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    board.appendChild(canvas);
    document.body.appendChild(board);
    return board;
}

/**
 * Creates the toolbar and appends it to the body.
 * @returns {HTMLElement} The created toolbar element.
 */
export function createToolbarElement() {
    let toolbar = document.getElementById(TOOLBAR_ID);
    if (toolbar) return toolbar;

    toolbar = document.createElement('div');
    toolbar.id = TOOLBAR_ID;

    // Keep the new tool layout and add the minimize button
    toolbar.innerHTML = `
        <div class="tool-group">
            <button data-tool="${TOOL_BRUSH}" title="Brush" class="active-tool">✏️</button>
            <button data-tool="${TOOL_ERASER}" title="Eraser">🧼</button>
            <button data-tool="${TOOL_TEXT}" title="Text">T</button>
        </div>
        <div class="tool-group">
            <label for="overdraw-color-picker">Color:</label>
            <input type="color" id="overdraw-color-picker" value="${DEFAULT_COLOR}" title="Color Picker">
        </div>
        <div class="tool-group">
            <label for="overdraw-brush-size">Size:</label>
            <input type="range" id="overdraw-brush-size" min="1" max="50" value="${DEFAULT_BRUSH_SIZE}" title="Brush Size">
            <span id="overdraw-brush-size-value">${DEFAULT_BRUSH_SIZE}px</span>
        </div>
        <div class="tool-group">
             <label for="overdraw-text-size">Text Size:</label>
            <input type="range" id="overdraw-text-size" min="8" max="72" value="${DEFAULT_TEXT_SIZE}" title="Text Size">
            <span id="overdraw-text-size-value">${DEFAULT_TEXT_SIZE}px</span>
        </div>
        <div class="tool-group">
            <button id="overdraw-undo" title="Undo (Ctrl+Z)">↩️</button>
            <button id="overdraw-redo" title="Redo (Ctrl+Y)">↪️</button>
        </div>
        <div class="tool-group">
            <button id="overdraw-clear" title="Clear Canvas">🗑️</button>
        </div>
        <button id="overdraw-minimize" title="Minimize/Expand Board"><=</button> <!-- Added Minimize Button -->
    `;
    document.body.appendChild(toolbar);
    return toolbar;
}