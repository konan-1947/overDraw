(() => {
  // js/core/constants.js
  var BOARD_ID = "overdraw-board";
  var CANVAS_ID = "overdraw-canvas";
  var TOOLBAR_ID = "overdraw-toolbar";
  var GUIDE_MODAL_ID = "overdraw-guide-modal";
  var TEXT_INPUT_ID = "overdraw-text-input";
  var DEFAULT_COLOR = "#000000";
  var DEFAULT_BRUSH_SIZE = 5;
  var DEFAULT_TEXT_SIZE = 16;
  var DEFAULT_FONT = "Arial";
  var TOOL_BRUSH = "brush";
  var TOOL_ERASER = "eraser";
  var TOOL_TEXT = "text";
  var STORAGE_KEY_GUIDE_SEEN = "overdrawGuideSeen";

  // js/core/state.js
  var appState = {
    isExtensionEnabled: false,
    // Overall F9 enable/disable state
    isBoardActive: false,
    // Tracks if the board elements are currently visible and interactive (after F9 enable and not minimized)
    isToolbarMinimized: false,
    currentTool: TOOL_BRUSH,
    currentColor: DEFAULT_COLOR,
    currentBrushSize: DEFAULT_BRUSH_SIZE,
    currentTextSize: DEFAULT_TEXT_SIZE,
    currentFont: DEFAULT_FONT,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    activeTouches: []
  };
  function getState() {
    return appState;
  }
  function updateState(newStateProperties) {
    appState = { ...appState, ...newStateProperties };
  }
  function resetDrawingState() {
    updateState({ isDrawing: false, activeTouches: [] });
  }

  // js/ui/domElements.js
  function createBoardElement() {
    let board = document.getElementById(BOARD_ID);
    if (board) return board;
    board = document.createElement("div");
    board.id = BOARD_ID;
    const canvas2 = document.createElement("canvas");
    canvas2.id = CANVAS_ID;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    board.appendChild(canvas2);
    document.body.appendChild(board);
    return board;
  }
  function createToolbarElement() {
    let toolbar = document.getElementById(TOOLBAR_ID);
    if (toolbar) return toolbar;
    toolbar = document.createElement("div");
    toolbar.id = TOOLBAR_ID;
    toolbar.innerHTML = `
        <div class="tool-group">
            <button data-tool="${TOOL_BRUSH}" title="Brush" class="active-tool">\u270F\uFE0F</button>
            <button data-tool="${TOOL_ERASER}" title="Eraser">\u{1F9FC}</button>
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
            <button id="overdraw-undo" title="Undo (Ctrl+Z)">\u21A9\uFE0F</button>
            <button id="overdraw-redo" title="Redo (Ctrl+Y)">\u21AA\uFE0F</button>
        </div>
        <div class="tool-group">
            <button id="overdraw-clear" title="Clear Canvas">\u{1F5D1}\uFE0F</button>
        </div>
        <button id="overdraw-minimize" title="Minimize/Expand Board"><=</button> <!-- Added Minimize Button -->
    `;
    document.body.appendChild(toolbar);
    return toolbar;
  }

  // js/canvas/canvasContext.js
  var canvas = null;
  var ctx = null;
  function initializeCanvas() {
    canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
      console.error("Canvas element not found!");
      return null;
    }
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      console.error("Failed to get 2D context from canvas!");
      return null;
    }
    const boardElement2 = canvas.parentElement;
    if (boardElement2) {
      canvas.width = boardElement2.clientWidth;
      canvas.height = boardElement2.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    updateState({});
    const state = getState();
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentBrushSize;
    ctx.fillStyle = state.currentColor;
    ctx.font = `${state.currentTextSize}px ${state.currentFont}`;
    console.log("Canvas initialized");
    return { canvas, ctx };
  }
  function getCanvas() {
    return canvas;
  }
  function getContext() {
    return ctx;
  }
  function clearDrawingArea() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.error("Context or Canvas not available for clearing.");
    }
  }
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const boardElement2 = canvas.parentElement;
    if (!boardElement2) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = boardElement2.clientWidth;
    canvas.height = boardElement2.clientHeight;
    ctx.putImageData(imageData, 0, 0);
    updateState({});
    const state = getState();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentBrushSize;
    ctx.fillStyle = state.currentColor;
    ctx.font = `${state.currentTextSize}px ${state.currentFont}`;
  }

  // js/canvas/undoRedo.js
  var undoStack = [];
  var redoStack = [];
  var MAX_HISTORY_STATES = 30;
  function recordCanvasState(canvas2) {
    if (!canvas2) return;
    if (undoStack.length >= MAX_HISTORY_STATES) {
      undoStack.shift();
    }
    undoStack.push(canvas2.toDataURL());
    redoStack = [];
    updateUndoRedoButtonStates();
  }
  function undoLastAction(canvas2, ctx2) {
    if (undoStack.length <= 1) return;
    const lastState = undoStack.pop();
    if (lastState) redoStack.push(lastState);
    const prevStateDataUrl = undoStack[undoStack.length - 1];
    if (prevStateDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img, 0, 0);
      };
      img.src = prevStateDataUrl;
    }
    updateUndoRedoButtonStates();
  }
  function redoLastAction(canvas2, ctx2) {
    if (redoStack.length === 0) return;
    const nextStateDataUrl = redoStack.pop();
    if (nextStateDataUrl) {
      undoStack.push(nextStateDataUrl);
      const img = new Image();
      img.onload = () => {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.drawImage(img, 0, 0);
      };
      img.src = nextStateDataUrl;
    }
    updateUndoRedoButtonStates();
  }
  function resetUndoRedoHistory(canvas2) {
    undoStack = [];
    redoStack = [];
    if (canvas2) {
      setTimeout(() => recordCanvasState(canvas2), 0);
    }
    updateUndoRedoButtonStates();
  }
  function updateUndoRedoButtonStates() {
    const undoButton = document.getElementById("overdraw-undo");
    const redoButton = document.getElementById("overdraw-redo");
    if (undoButton) {
      undoButton.disabled = undoStack.length <= 1;
    }
    if (redoButton) {
      redoButton.disabled = redoStack.length === 0;
    }
  }

  // js/tools/brush.js
  function drawWithBrush(x1, y1, x2, y2) {
    const ctx2 = getContext();
    const state = getState();
    if (!ctx2) return;
    ctx2.globalCompositeOperation = "source-over";
    ctx2.strokeStyle = state.currentColor;
    ctx2.lineWidth = state.currentBrushSize;
    if (x1 === x2 && y1 === y2) {
      ctx2.beginPath();
      ctx2.arc(x1, y1, state.currentBrushSize / 2, 0, Math.PI * 2);
      ctx2.fillStyle = state.currentColor;
      ctx2.fill();
    } else {
      ctx2.lineTo(x2, y2);
      ctx2.stroke();
    }
  }

  // js/tools/eraser.js
  function eraseArea(x1, y1, x2, y2) {
    const ctx2 = getContext();
    const state = getState();
    if (!ctx2) return;
    ctx2.globalCompositeOperation = "destination-out";
    ctx2.lineWidth = state.currentBrushSize;
    if (x1 === x2 && y1 === y2) {
      ctx2.beginPath();
      ctx2.arc(x1, y1, state.currentBrushSize / 2, 0, Math.PI * 2);
      ctx2.fill();
    } else {
      ctx2.lineTo(x2, y2);
      ctx2.stroke();
    }
  }

  // js/tools/textTool.js
  var textInputElement2 = null;
  function activateTextMode(initialX, initialY) {
    try {
      const canvas2 = getCanvas();
      if (!canvas2) throw new Error("Canvas not found in activateTextMode");
      if (textInputElement2) {
        deactivateTextMode(false);
      }
      textInputElement2 = document.createElement("textarea");
      textInputElement2.id = TEXT_INPUT_ID;
      textInputElement2.style.position = "fixed";
      textInputElement2.style.left = `${initialX}px`;
      textInputElement2.style.top = `${initialY}px`;
      const state = getState();
      textInputElement2.style.fontSize = `${state.currentTextSize}px`;
      textInputElement2.style.fontFamily = state.currentFont;
      textInputElement2.style.color = state.currentColor;
      textInputElement2.style.lineHeight = `${state.currentTextSize * 1.2}px`;
      textInputElement2.style.minWidth = "50px";
      textInputElement2.style.minHeight = `${state.currentTextSize * 1.2}px`;
      textInputElement2.value = "";
      document.body.appendChild(textInputElement2);
      textInputElement2.focus();
      textInputElement2.addEventListener("keydown", handleTextInputKeyDown);
      console.log("Text tool activated at", initialX, initialY);
    } catch (err) {
      console.error("Error in activateTextMode:", err);
    }
  }
  function handleTextInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      placeTextOnCanvas2();
    } else if (event.key === "Escape") {
      deactivateTextMode(false);
    }
  }
  function placeTextOnCanvas2() {
    try {
      if (!textInputElement2 || !textInputElement2.value.trim()) {
        deactivateTextMode(false);
        return;
      }
      const ctx2 = getContext();
      const canvas2 = getCanvas();
      const state = getState();
      if (!ctx2 || !canvas2) throw new Error("Canvas or context not found in placeTextOnCanvas");
      const text = textInputElement2.value;
      const x = parseFloat(textInputElement2.style.left);
      const y = parseFloat(textInputElement2.style.top);
      ctx2.globalCompositeOperation = "source-over";
      ctx2.fillStyle = state.currentColor;
      ctx2.font = `${state.currentTextSize}px ${state.currentFont}`;
      ctx2.textAlign = "left";
      ctx2.textBaseline = "alphabetic";
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        ctx2.fillText(line, x, y + index * state.currentTextSize * 1.2);
      });
      recordCanvasState(canvas2);
      deactivateTextMode(true);
    } catch (err) {
      console.error("Error in placeTextOnCanvas:", err);
    }
  }
  function deactivateTextMode(textWasPlaced) {
    try {
      if (textInputElement2) {
        textInputElement2.remove();
        textInputElement2 = null;
        console.log("Text tool deactivated.");
      }
    } catch (err) {
      console.error("Error in deactivateTextMode:", err);
    }
  }

  // js/tools/toolManager.js
  function setCurrentTool(toolName) {
    deactivateTextToolIfNeeded();
    updateState({ currentTool: toolName });
    console.log(`Tool changed to: ${toolName}`);
    const canvas2 = getCanvas();
    if (canvas2) {
      switch (toolName) {
        case TOOL_BRUSH:
        case TOOL_ERASER:
          canvas2.style.cursor = "crosshair";
          break;
        case TOOL_TEXT:
          canvas2.style.cursor = "text";
          break;
        default:
          canvas2.style.cursor = "default";
      }
    }
    updateActiveToolButton(toolName);
  }
  function applyCurrentTool(x1, y1, x2, y2) {
    const state = getState();
    switch (state.currentTool) {
      case TOOL_BRUSH:
        drawWithBrush(x1, y1, x2, y2);
        break;
      case TOOL_ERASER:
        eraseArea(x1, y1, x2, y2);
        break;
      case TOOL_TEXT:
        activateTextMode(x1, y1);
        break;
    }
  }
  function deactivateTextToolIfNeeded() {
    const state = getState();
    if (state.currentTool === TOOL_TEXT) {
      const textInputElement3 = document.getElementById(TEXT_INPUT_ID);
      if (textInputElement3 && document.activeElement === textInputElement3) {
        textInputElement3.blur();
      } else if (textInputElement3) {
        deactivateTextMode(false);
      }
    }
  }
  function updateActiveToolButton(activeToolName) {
    const toolbar = document.getElementById("overdraw-toolbar");
    if (!toolbar) return;
    const toolButtons = toolbar.querySelectorAll("button[data-tool]");
    toolButtons.forEach((button) => {
      if (button.dataset.tool === activeToolName) {
        button.classList.add("active-tool");
      } else {
        button.classList.remove("active-tool");
      }
    });
  }

  // js/ui/toolbarController.js
  var toolbarElement = null;
  var boardElementRef = null;
  function initializeToolbar() {
    toolbarElement = document.getElementById(TOOLBAR_ID);
    boardElementRef = document.getElementById(BOARD_ID);
    if (!toolbarElement || !boardElementRef) {
      console.error("Toolbar or Board element not found for initialization.");
      return;
    }
    toolbarElement.addEventListener("click", (event) => {
      try {
        const button = event.target.closest("button[data-tool]");
        if (button && button.dataset.tool) {
          deactivateTextToolIfNeeded();
          setCurrentTool(button.dataset.tool);
        }
      } catch (err) {
        console.error("Error handling toolbar click:", err);
      }
    });
    const colorPicker = toolbarElement.querySelector("#overdraw-color-picker");
    if (colorPicker) {
      colorPicker.addEventListener("input", handleColorChange);
      colorPicker.addEventListener("change", handleColorChangeFinal);
    }
    const brushSizeSlider = toolbarElement.querySelector("#overdraw-brush-size");
    const brushSizeValueDisplay = toolbarElement.querySelector("#overdraw-brush-size-value");
    if (brushSizeSlider && brushSizeValueDisplay) {
      brushSizeSlider.addEventListener("input", (event) => {
        const newSize = parseInt(event.target.value, 10);
        updateState({ currentBrushSize: newSize });
        brushSizeValueDisplay.textContent = `${newSize}px`;
        const ctx2 = getContext();
        if (ctx2) ctx2.lineWidth = newSize;
      });
    }
    const textSizeSlider = toolbarElement.querySelector("#overdraw-text-size");
    const textSizeValueDisplay = toolbarElement.querySelector("#overdraw-text-size-value");
    if (textSizeSlider && textSizeValueDisplay) {
      textSizeSlider.addEventListener("input", (event) => {
        const newSize = parseInt(event.target.value, 10);
        updateState({ currentTextSize: newSize });
        textSizeValueDisplay.textContent = `${newSize}px`;
        const ctx2 = getContext();
        if (ctx2) ctx2.font = `${newSize}px ${getState().currentFont}`;
      });
    }
    const clearButton = toolbarElement.querySelector("#overdraw-clear");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear the canvas?")) {
          clearDrawingArea();
          resetUndoRedoHistory(getCanvas());
        }
      });
    }
    const undoButton = toolbarElement.querySelector("#overdraw-undo");
    if (undoButton) {
      undoButton.addEventListener("click", () => undoLastAction(getCanvas(), getContext()));
    }
    const redoButton = toolbarElement.querySelector("#overdraw-redo");
    if (redoButton) {
      redoButton.addEventListener("click", () => redoLastAction(getCanvas(), getContext()));
    }
    const minimizeButton = toolbarElement.querySelector("#overdraw-minimize");
    if (minimizeButton) {
      minimizeButton.addEventListener("click", toggleBoardMinimize);
    }
    console.log("Toolbar initialized and events bound.");
  }
  function handleColorChange(event) {
    const newColor = event.target.value;
    updateState({ currentColor: newColor });
    const ctx2 = getContext();
    if (ctx2) {
      ctx2.strokeStyle = newColor;
      ctx2.fillStyle = newColor;
    }
  }
  function handleColorChangeFinal(event) {
    handleColorChange(event);
    console.log("Final color selected:", event.target.value);
  }
  function toggleBoardMinimize() {
    try {
      const state = getState();
      const isMinimized = !state.isToolbarMinimized;
      updateState({ isToolbarMinimized: isMinimized });
      const minimizeButton = toolbarElement.querySelector("#overdraw-minimize");
      if (isMinimized) {
        boardElementRef.style.display = "none";
        toolbarElement.querySelectorAll(".tool-group").forEach((group) => group.style.display = "none");
        if (minimizeButton) minimizeButton.innerHTML = "=>";
        document.documentElement.style.overflow = "";
        updateState({ isBoardActive: false });
        deactivateTextToolIfNeeded();
      } else {
        boardElementRef.style.display = "block";
        resizeCanvas();
        toolbarElement.querySelectorAll(".tool-group").forEach((group) => group.style.display = "flex");
        if (minimizeButton) minimizeButton.innerHTML = "<=";
        document.documentElement.style.overflow = "hidden";
        updateState({ isBoardActive: true });
      }
      console.log(`Board minimized: ${isMinimized}`);
    } catch (err) {
      console.error("Error in toggleBoardMinimize:", err);
    }
  }
  function resetToolbarToDefaultState() {
    updateState({ isToolbarMinimized: false });
    if (toolbarElement) {
      const minimizeButton = toolbarElement.querySelector("#overdraw-minimize");
      if (minimizeButton) minimizeButton.innerHTML = "<=";
      toolbarElement.querySelectorAll(".tool-group").forEach((group) => group.style.display = "flex");
    }
  }

  // js/utils/storage.js
  async function getStorage(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error(`Error getting item ${key} from storage:`, error);
      return void 0;
    }
  }
  async function setStorage(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error(`Error setting item ${key} in storage:`, error);
    }
  }

  // js/ui/firstRunGuide.js
  var guideModalElement = null;
  function createGuideModalDOM() {
    if (document.getElementById(GUIDE_MODAL_ID)) {
      guideModalElement = document.getElementById(GUIDE_MODAL_ID);
      return;
    }
    guideModalElement = document.createElement("div");
    guideModalElement.id = GUIDE_MODAL_ID;
    guideModalElement.innerHTML = `
        <h3>Welcome to OverDraw Enhanced!</h3>
        <p>Here are some quick tips to get you started:</p>
        <ul>
            <li>Press <strong>F9</strong> to toggle the drawing board on and off.</li>
            <li>Use the toolbar to select tools (Brush, Eraser, Text).</li>
            <li>Adjust color and brush/text size using the controls.</li>
            <li>Undo/Redo your actions with the arrow buttons.</li>
            <li>Clear the canvas with the trash icon.</li>
        </ul>
        <button id="overdraw-guide-close">Got it!</button>
    `;
    document.body.appendChild(guideModalElement);
    const closeButton = guideModalElement.querySelector("#overdraw-guide-close");
    if (closeButton) {
      closeButton.addEventListener("click", hideGuideModal);
    }
  }
  function showGuideModal() {
    if (!guideModalElement) createGuideModalDOM();
    if (guideModalElement) {
      guideModalElement.style.display = "block";
    }
  }
  function hideGuideModal() {
    if (guideModalElement) {
      guideModalElement.style.display = "none";
    }
    setStorage(STORAGE_KEY_GUIDE_SEEN, true);
  }
  async function checkAndShowFirstRunGuide() {
    const hasSeenGuide = await getStorage(STORAGE_KEY_GUIDE_SEEN);
    if (!hasSeenGuide) {
      showGuideModal();
    }
  }

  // js/canvas/inputHandler.js
  var ongoingTouches = [];
  function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY, clientX: touch.clientX, clientY: touch.clientY };
  }
  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      if (ongoingTouches[i].identifier === idToFind) {
        return i;
      }
    }
    return -1;
  }
  function getMousePosition2(event) {
    const canvas2 = getCanvas();
    if (!canvas2) return { x: 0, y: 0 };
    const rect = canvas2.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  function handleMouseDown(event) {
    if (event.button !== 0) return;
    const { x, y } = getMousePosition2(event);
    const state = getState();
    const ctx2 = getContext();
    updateState({ isDrawing: true, lastX: x, lastY: y });
    if (state.currentTool !== TOOL_TEXT) {
      ctx2.beginPath();
      ctx2.moveTo(x, y);
      applyCurrentTool(x, y, x, y);
    } else {
      applyCurrentTool(x, y);
    }
  }
  function handleMouseMove(event) {
    const state = getState();
    if (!state.isDrawing || state.currentTool === TOOL_TEXT) return;
    const { x, y } = getMousePosition2(event);
    applyCurrentTool(state.lastX, state.lastY, x, y);
    updateState({ lastX: x, lastY: y });
  }
  function handleMouseUp() {
    const state = getState();
    if (state.isDrawing && state.currentTool !== TOOL_TEXT) {
      recordCanvasState(getCanvas());
    }
    resetDrawingState();
  }
  function handleTouchStart(event) {
    event.preventDefault();
    deactivateTextToolIfNeeded();
    const touches = event.changedTouches;
    const canvas2 = getCanvas();
    const ctx2 = getContext();
    const state = getState();
    if (!canvas2 || !ctx2) return;
    for (let i = 0; i < touches.length; i++) {
      ongoingTouches.push(copyTouch(touches[i]));
      const rect = canvas2.getBoundingClientRect();
      const x = touches[i].clientX - rect.left;
      const y = touches[i].clientY - rect.top;
      if (state.currentTool !== TOOL_TEXT) {
        ctx2.beginPath();
        ctx2.moveTo(x, y);
        applyCurrentTool(x, y, x, y);
      } else {
        applyCurrentTool(x, y);
      }
    }
    updateState({ isDrawing: true });
  }
  function handleTouchMove(event) {
    event.preventDefault();
    const state = getState();
    if (!state.isDrawing || state.currentTool === TOOL_TEXT) return;
    const touches = event.changedTouches;
    const canvas2 = getCanvas();
    const ctx2 = getContext();
    if (!canvas2 || !ctx2) return;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const idx = ongoingTouchIndexById(touch.identifier);
      if (idx >= 0) {
        const rect = canvas2.getBoundingClientRect();
        const prevX = ongoingTouches[idx].clientX - rect.left;
        const prevY = ongoingTouches[idx].clientY - rect.top;
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;
        applyCurrentTool(prevX, prevY, currentX, currentY);
        ongoingTouches.splice(idx, 1, copyTouch(touch));
      }
    }
  }
  function handleTouchEnd(event) {
    event.preventDefault();
    const touches = event.changedTouches;
    const state = getState();
    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1);
      }
    }
    if (ongoingTouches.length === 0) {
      if (state.isDrawing && state.currentTool !== TOOL_TEXT) {
        recordCanvasState(getCanvas());
      }
      resetDrawingState();
    }
  }

  // js/canvas/eventBinder.js
  function bindCanvasEvents() {
    const canvas2 = getCanvas();
    if (!canvas2) {
      console.error("Canvas not found for event binding.");
      return;
    }
    canvas2.addEventListener("mousedown", handleMouseDown);
    canvas2.addEventListener("mousemove", handleMouseMove);
    canvas2.addEventListener("mouseup", handleMouseUp);
    canvas2.addEventListener("mouseleave", handleMouseUp);
    canvas2.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas2.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas2.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas2.addEventListener("touchcancel", handleTouchEnd, { passive: false });
    window.addEventListener("resize", resizeCanvas);
    console.log("Canvas events bound.");
  }
  function unbindCanvasEvents() {
    const canvas2 = getCanvas();
    if (!canvas2) return;
    canvas2.removeEventListener("mousedown", handleMouseDown);
    canvas2.removeEventListener("mousemove", handleMouseMove);
    canvas2.removeEventListener("mouseup", handleMouseUp);
    canvas2.removeEventListener("mouseleave", handleMouseUp);
    canvas2.removeEventListener("touchstart", handleTouchStart);
    canvas2.removeEventListener("touchmove", handleTouchMove);
    canvas2.removeEventListener("touchend", handleTouchEnd);
    canvas2.removeEventListener("touchcancel", handleTouchEnd);
    window.removeEventListener("resize", resizeCanvas);
    console.log("Canvas events unbound.");
  }

  // js/main.js
  var boardElement = null;
  var toolbarElement2 = null;
  function enableExtension() {
    if (getState().isExtensionEnabled) return;
    boardElement = document.getElementById(BOARD_ID);
    toolbarElement2 = document.getElementById(TOOLBAR_ID);
    if (!boardElement || !toolbarElement2) {
      console.error("Board or Toolbar element not found during enableExtension");
      return;
    }
    toolbarElement2.style.display = "flex";
    boardElement.style.zIndex = "9999990";
    boardElement.style.top = "0";
    boardElement.style.display = "block";
    document.documentElement.style.overflow = "hidden";
    updateState({ isExtensionEnabled: true, isBoardActive: true, isToolbarMinimized: false });
    resetToolbarToDefaultState();
    const canvasData = initializeCanvas();
    if (canvasData) {
      bindCanvasEvents();
      resetUndoRedoHistory(canvasData.canvas);
      setCurrentTool(TOOL_BRUSH);
      resizeCanvas();
    }
    checkAndShowFirstRunGuide();
    console.log("OverDraw extension enabled.");
  }
  function disableExtension() {
    if (!getState().isExtensionEnabled) return;
    deactivateTextToolIfNeeded();
    if (boardElement && toolbarElement2) {
      toolbarElement2.style.display = "none";
      boardElement.style.zIndex = "-99999";
      boardElement.style.top = "-200vh";
    }
    unbindCanvasEvents();
    document.documentElement.style.overflow = "";
    updateState({ isExtensionEnabled: false, isBoardActive: false });
    console.log("OverDraw extension disabled.");
  }
  function handleGlobalKeyDown(event) {
    if (event.key === "F9") {
      event.preventDefault();
      const state = getState();
      if (!state.isExtensionEnabled) {
        if (confirm("Enable OverDraw board?")) {
          enableExtension();
        }
      } else {
        if (confirm("Disable OverDraw board?")) {
          disableExtension();
        }
      }
    } else if (getState().isBoardActive) {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        const undoButton = document.getElementById("overdraw-undo");
        if (undoButton && !undoButton.disabled) undoButton.click();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        const redoButton = document.getElementById("overdraw-redo");
        if (redoButton && !redoButton.disabled) redoButton.click();
      }
    }
  }
  function initializeExtensionFramework() {
    console.log("Initializing OverDraw Enhanced Framework...");
    boardElement = createBoardElement();
    toolbarElement2 = createToolbarElement();
    initializeToolbar();
    document.addEventListener("keydown", handleGlobalKeyDown);
    console.log("OverDraw Enhanced framework initialized. Press F9 to toggle.");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeExtensionFramework);
  } else {
    initializeExtensionFramework();
  }
})();
//# sourceMappingURL=bundle.js.map
