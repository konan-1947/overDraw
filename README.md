# OverDraw Enhanced

**Vẽ trực tiếp lên bất kỳ trang web nào với các công cụ nâng cao!**

OverDraw Enhanced là một tiện ích mở rộng (extension) cho trình duyệt Google Chrome (và các trình duyệt dựa trên Chromium) cho phép người dùng kích hoạt một bảng vẽ phủ lên trang web hiện tại. Người dùng có thể sử dụng các công cụ như bút vẽ, tẩy, công cụ văn bản, chọn màu, điều chỉnh kích thước bút, hoàn tác/làm lại hành động để ghi chú, phác thảo hoặc đánh dấu trực tiếp trên nội dung web.

## Mục lục

*   [Tính năng chính](#tính-năng-chính)
*   [Cài đặt](#cài-đặt)
*   [Cách sử dụng](#cách-sử-dụng)
*   [Cấu trúc dự án](#cấu-trúc-dự-án)
*   [Cách hoạt động của từng chức năng](#cách-hoạt-động-của-từng-chức-năng)
    *   [Kích hoạt / Vô hiệu hóa Bảng vẽ (F9)](#kích-hoạt--vô-hiệu-hóa-bảng-vẽ-f9)
    *   [Thu nhỏ / Mở rộng Bảng vẽ](#thu-nhỏ--mở-rộng-bảng-vẽ)
    *   [Thanh công cụ](#thanh-công-cụ)
    *   [Công cụ Bút vẽ (Brush)](#công-cụ-bút-vẽ-brush)
    *   [Công cụ Tẩy (Eraser)](#công-cụ-tẩy-eraser)
    *   [Công cụ Văn bản (Text Tool)](#công-cụ-văn-bản-text-tool)
    *   [Chọn màu (Color Picker)](#chọn-màu-color-picker)
    *   [Kích thước Bút vẽ / Văn bản](#kích-thước-bút-vẽ--văn-bản)
    *   [Hoàn tác / Làm lại (Undo/Redo)](#hoàn-tác--làm-lại-undoredo)
    *   [Xóa bảng vẽ (Clear Canvas)](#xóa-bảng-vẽ-clear-canvas)
    *   [Hướng dẫn lần đầu](#hướng-dẫn-lần-đầu)
*   [Đóng góp](#đóng-góp)
*   [Giấy phép](#giấy-phép)
*   [Building the Extension](#building-the-extension)
    *   [Prerequisites](#prerequisites)
    *   [Install dependencies](#install-dependencies)
    *   [Build the bundle](#build-the-bundle)

## Tính năng chính

*   **Kích hoạt/Vô hiệu hóa bằng phím F9:** Dễ dàng bật hoặc tắt bảng vẽ trên bất kỳ trang web nào.
*   **Bảng vẽ toàn màn hình:** Canvas vẽ phủ lên toàn bộ nội dung trang.
*   **Thanh công cụ trực quan:**
    *   Công cụ Bút vẽ (Brush)
    *   Công cụ Tẩy (Eraser)
    *   Công cụ Văn bản (Text Tool)
    *   Bộ chọn màu (Color Picker)
    *   Điều chỉnh kích thước bút vẽ và kích thước văn bản (dạng thanh trượt).
    *   Hoàn tác (Undo) và Làm lại (Redo) các hành động vẽ.
    *   Nút Xóa toàn bộ bảng vẽ (Clear Canvas).
    *   Nút Thu nhỏ/Mở rộng bảng vẽ và thanh công cụ.
*   **Hỗ trợ chuột và cảm ứng:** Vẽ mượt mà bằng cả chuột và thiết bị cảm ứng.
*   **Hướng dẫn sử dụng lần đầu:** Một popup nhỏ hướng dẫn người dùng mới về các tính năng cơ bản.
*   **Modular Codebase:** Mã nguồn được tổ chức thành các module JavaScript (ES6 Modules) để dễ quản lý và bảo trì.

## Cài đặt

1.  Tải xuống (hoặc clone) toàn bộ mã nguồn của dự án này.
2.  Mở trình duyệt Google Chrome, điều hướng đến `chrome://extensions/`.
3.  Bật chế độ **Developer mode** (Chế độ nhà phát triển) ở góc trên bên phải.
4.  Nhấp vào nút **Load unpacked** (Tải tiện ích đã giải nén).
5.  Chọn thư mục gốc của dự án (`overdraw-enhanced/`) mà bạn vừa tải về/clone.
6.  Tiện ích OverDraw Enhanced sẽ được cài đặt và sẵn sàng để sử dụng. Biểu tượng của tiện ích sẽ xuất hiện trên thanh công cụ của trình duyệt.

## Cách sử dụng

1.  Truy cập bất kỳ trang web nào bạn muốn vẽ lên.
2.  Nhấn phím **F9**. Một hộp thoại xác nhận sẽ hiện ra, hỏi bạn có muốn kích hoạt bảng vẽ không. Chọn "OK".
3.  Bảng vẽ và thanh công cụ sẽ xuất hiện.
4.  Sử dụng các công cụ trên thanh công cụ để bắt đầu vẽ.
5.  Để thu nhỏ bảng vẽ và thanh công cụ (chỉ giữ lại nút mở rộng), nhấp vào nút `<=` trên thanh công cụ. Nhấp `=>` để mở rộng lại.
6.  Nhấn **F9** một lần nữa để vô hiệu hóa hoàn toàn bảng vẽ (sẽ có hộp thoại xác nhận).

## Cấu trúc dự án

```
overdraw-enhanced/
├── icons/                  # Icon của tiện ích ở các kích thước khác nhau
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── css/
│   └── styles.css          # Định dạng CSS cho bảng vẽ, thanh công cụ, modal
├── js/
│   ├── main.js             # Điểm vào chính, điều phối toàn bộ tiện ích
│   │
│   ├── core/               # Các module cốt lõi
│   │   ├── state.js        # Quản lý trạng thái toàn cục của ứng dụng
│   │   └── constants.js    # Các hằng số (ID, tên class, giá trị mặc định)
│   │
│   ├── ui/                 # Các module liên quan đến giao diện người dùng
│   │   ├── domElements.js  # Tạo các phần tử DOM chính (bảng, toolbar)
│   │   ├── styleManager.js # (Hiện không dùng nhiều do CSS qua manifest)
│   │   ├── toolbarController.js # Xử lý sự kiện và logic cho thanh công cụ
│   │   └── firstRunGuide.js# Hiển thị modal hướng dẫn lần đầu
│   │
│   ├── canvas/             # Các module liên quan đến canvas vẽ
│   │   ├── canvasContext.js # Quản lý canvas và context 2D
│   │   ├── eventBinder.js  # Gắn các sự kiện (mouse, touch) cho canvas
│   │   ├── inputHandler.js # Xử lý sự kiện đầu vào, lấy tọa độ
│   │   └── undoRedo.js     # Logic Hoàn tác/Làm lại
│   │
│   ├── tools/              # Các module cho từng công cụ vẽ
│   │   ├── brush.js        # Logic công cụ Bút vẽ
│   │   ├── eraser.js       # Logic công cụ Tẩy
│   │   ├── textTool.js     # Logic công cụ Văn bản
│   │   └── toolManager.js  # Quản lý việc chuyển đổi giữa các công cụ
│   │
│   └── utils/              # Các hàm tiện ích nhỏ
│       └── storage.js      # Helper cho chrome.storage.local
│
├── popup/                  # Giao diện khi nhấp vào icon tiện ích
│   ├── popup.html
│   └── popup.js            # (Tùy chọn, nếu popup cần JavaScript)
├── manifest.json           # File cấu hình chính của tiện ích mở rộng
└── README.md               # Chính là file này
```

## Cách hoạt động của từng chức năng

### Kích hoạt / Vô hiệu hóa Bảng vẽ (F9)

*   **File chính:** `js/main.js` (hàm `handleGlobalKeyDown`, `enableExtension`, `disableExtension`)
*   **Hoạt động:**
    *   Lắng nghe sự kiện nhấn phím trên toàn bộ tài liệu.
    *   Khi phím `F9` được nhấn:
        *   Nếu tiện ích đang tắt (`isExtensionEnabled` là `false`): Hiển thị hộp thoại `confirm("Enable OverDraw board?")`. Nếu người dùng đồng ý:
            *   Hiển thị thanh công cụ (`toolbarElement.style.display = 'flex'`).
            *   Đưa bảng vẽ (`boardElement`) lên trên cùng (`z-index`), vào trong viewport (`top = '0'`), và hiển thị nó.
            *   Chặn cuộn trang (`document.documentElement.style.overflow = 'hidden'`).
            *   Khởi tạo canvas, context, gắn các sự kiện vẽ, và reset lịch sử undo/redo.
            *   Cập nhật trạng thái `isExtensionEnabled = true`, `isBoardActive = true`.
            *   Kiểm tra và hiển thị hướng dẫn lần đầu nếu cần.
        *   Nếu tiện ích đang bật (`isExtensionEnabled` là `true`): Hiển thị hộp thoại `confirm("Disable OverDraw board?")`. Nếu người dùng đồng ý:
            *   Ẩn thanh công cụ.
            *   Đưa bảng vẽ ra sau, ra khỏi viewport.
            *   Hủy gắn các sự kiện vẽ.
            *   Cho phép cuộn trang trở lại.
            *   Cập nhật trạng thái `isExtensionEnabled = false`, `isBoardActive = false`.

### Thu nhỏ / Mở rộng Bảng vẽ

*   **File chính:** `js/ui/toolbarController.js` (hàm `toggleBoardMinimize`)
*   **Hoạt động:**
    *   Nút `<=` (Minimize) / `=>` (Expand) trên thanh công cụ kích hoạt hàm này.
    *   **Khi thu nhỏ (`isToolbarMinimized` chuyển thành `true`):**
        *   Ẩn bảng vẽ chính (`boardElement.style.display = 'none'`).
        *   Ẩn các nhóm công cụ (`.tool-group`) trên thanh công cụ, chỉ giữ lại nút Minimize/Expand.
        *   Đổi text của nút thành `=>`.
        *   Cho phép cuộn trang.
        *   Cập nhật trạng thái `isBoardActive = false` (vì không thể vẽ khi thu nhỏ).
    *   **Khi mở rộng (`isToolbarMinimized` chuyển thành `false`):**
        *   Hiển thị lại bảng vẽ chính.
        *   Hiển thị lại tất cả các nhóm công cụ.
        *   Đổi text của nút thành `<=`.
        *   Chặn cuộn trang.
        *   Cập nhật trạng thái `isBoardActive = true`.
        *   Gọi `resizeCanvas()` để đảm bảo canvas có kích thước đúng sau khi hiển thị lại.

### Thanh công cụ

*   **Files chính:** `js/ui/domElements.js` (tạo HTML), `js/ui/toolbarController.js` (xử lý sự kiện), `css/styles.css` (định dạng)
*   **Hoạt động:**
    *   Được tạo động và thêm vào `<body>` khi tiện ích khởi tạo.
    *   Chứa các nút và điều khiển cho từng công cụ.
    *   `toolbarController.js` lắng nghe các sự kiện click, input, change trên các phần tử của toolbar để cập nhật trạng thái (`js/core/state.js`) và gọi các hàm tương ứng (ví dụ: `setCurrentTool`, `updateState` cho màu/kích thước).

### Công cụ Bút vẽ (Brush)

*   **Files chính:** `js/tools/brush.js`, `js/tools/toolManager.js`, `js/canvas/inputHandler.js`
*   **Hoạt động:**
    *   Khi được chọn từ toolbar, `toolManager.js` cập nhật `state.currentTool = TOOL_BRUSH`.
    *   `inputHandler.js` xử lý sự kiện `mousedown`/`touchstart`: bắt đầu một đường vẽ mới (`ctx.beginPath()`, `ctx.moveTo()`).
    *   Khi `mousemove`/`touchmove`: `inputHandler.js` gọi `applyCurrentTool` trong `toolManager.js`, hàm này sẽ gọi `drawWithBrush` từ `brush.js`.
    *   `drawWithBrush`:
        *   Đặt `ctx.globalCompositeOperation = 'source-over'` (chế độ vẽ bình thường).
        *   Lấy `state.currentColor` và `state.currentBrushSize` để đặt `ctx.strokeStyle` và `ctx.lineWidth`.
        *   Vẽ một đường (`ctx.lineTo()`, `ctx.stroke()`) đến vị trí chuột/chạm mới. Nếu là một điểm đơn (click), vẽ một hình tròn nhỏ.
    *   Khi `mouseup`/`touchend`: `inputHandler.js` cập nhật `state.isDrawing = false` và gọi `recordCanvasState` để lưu vào lịch sử Undo.

### Công cụ Tẩy (Eraser)

*   **Files chính:** `js/tools/eraser.js`, `js/tools/toolManager.js`, `js/canvas/inputHandler.js`
*   **Hoạt động:** Tương tự như Bút vẽ, nhưng:
    *   `eraseArea` trong `eraser.js` được gọi.
    *   Đặt `ctx.globalCompositeOperation = 'destination-out'`. Thao tác vẽ với chế độ này sẽ làm cho các pixel trở nên trong suốt, tạo hiệu ứng tẩy.
    *   Kích thước tẩy sử dụng `state.currentBrushSize`.

### Công cụ Văn bản (Text Tool)

*   **Files chính:** `js/tools/textTool.js`, `js/tools/toolManager.js`, `js/canvas/inputHandler.js`
*   **Hoạt động:**
    *   Khi được chọn, `toolManager.js` cập nhật `state.currentTool = TOOL_TEXT` và đổi con trỏ thành dạng text.
    *   Khi người dùng nhấp chuột (`mousedown`/`touchstart`) lên canvas:
        *   `inputHandler.js` gọi `applyCurrentTool` -> `activateTextMode` trong `textTool.js`.
        *   `activateTextMode`:
            *   Tạo một phần tử `<textarea id="overdraw-text-input">` tạm thời, định vị nó tại điểm nhấp chuột, phủ lên trên canvas.
            *   Áp dụng các style (font, size, color) từ `state` cho textarea.
            *   Focus vào textarea.
    *   Người dùng nhập văn bản.
    *   Khi textarea mất focus (`blur`) hoặc người dùng nhấn `Enter` (không phải `Shift+Enter`):
        *   `placeTextOnCanvas` được gọi.
        *   Lấy nội dung text từ textarea.
        *   Sử dụng `ctx.fillText()` để vẽ text lên canvas tại vị trí của textarea. Xử lý xuống dòng nếu có.
        *   Màu và font được lấy từ `state`.
        *   Xóa textarea tạm thời.
        *   Gọi `recordCanvasState` để lưu vào lịch sử Undo.
    *   Nếu nhấn `Escape` trong textarea, hủy bỏ việc nhập text.

### Chọn màu (Color Picker)

*   **File chính:** `js/ui/toolbarController.js` (hàm `handleColorChange`)
*   **Hoạt động:**
    *   Một phần tử `<input type="color">` trên thanh công cụ.
    *   Khi người dùng chọn một màu mới (sự kiện `input` hoặc `change`):
        *   `handleColorChange` được gọi.
        *   Cập nhật `state.currentColor`.
        *   Cập nhật `ctx.strokeStyle` và `ctx.fillStyle` để các thao tác vẽ/text tiếp theo sử dụng màu mới.

### Kích thước Bút vẽ / Văn bản

*   **File chính:** `js/ui/toolbarController.js`
*   **Hoạt động:**
    *   Hai phần tử `<input type="range">` trên thanh công cụ, một cho kích thước bút vẽ, một cho kích thước văn bản.
    *   Khi người dùng kéo thanh trượt (sự kiện `input`):
        *   Cập nhật `state.currentBrushSize` hoặc `state.currentTextSize`.
        *   Hiển thị giá trị kích thước hiện tại bên cạnh thanh trượt.
        *   Cập nhật `ctx.lineWidth` (cho bút vẽ/tẩy) hoặc `ctx.font` (cho văn bản) ngay lập tức.

### Hoàn tác / Làm lại (Undo/Redo)

*   **Files chính:** `js/canvas/undoRedo.js`, `js/ui/toolbarController.js`
*   **Hoạt động:**
    *   **`recordCanvasState(canvas)`:**
        *   Được gọi sau mỗi thao tác vẽ hoàn chỉnh (mouseup, touchend, text placed).
        *   Sử dụng `canvas.toDataURL()` để lấy trạng thái hiện tại của canvas dưới dạng ảnh Base64.
        *   Đẩy chuỗi Base64 này vào `undoStack`.
        *   Nếu `undoStack` quá đầy (vượt `MAX_HISTORY_STATES`), xóa trạng thái cũ nhất.
        *   Xóa `redoStack` vì một hành động mới làm mất hiệu lực các hành động redo trước đó.
        *   Cập nhật trạng thái `disabled` của nút Undo/Redo.
    *   **`undoLastAction(canvas, ctx)`:**
        *   Nếu `undoStack` có nhiều hơn 1 trạng thái (trạng thái đầu tiên là trạng thái rỗng/ban đầu).
        *   Lấy trạng thái cuối cùng từ `undoStack` và đẩy vào `redoStack`.
        *   Lấy trạng thái mới nhất từ `undoStack` (giờ là trạng thái trước đó).
        *   Tạo một `Image` object, đặt `src` là chuỗi Base64 của trạng thái đó.
        *   Khi ảnh tải xong (`img.onload`), xóa canvas và vẽ lại ảnh này lên canvas (`ctx.drawImage(img, 0, 0)`).
        *   Cập nhật trạng thái nút.
    *   **`redoLastAction(canvas, ctx)`:**
        *   Nếu `redoStack` có phần tử.
        *   Lấy trạng thái cuối cùng từ `redoStack` và đẩy lại vào `undoStack`.
        *   Tải và vẽ lại ảnh tương tự như Undo.
        *   Cập nhật trạng thái nút.
    *   **Phím tắt:** `Ctrl+Z` cho Undo, `Ctrl+Y` cho Redo được xử lý trong `js/main.js` (chỉ khi bảng vẽ đang hoạt động).

### Xóa bảng vẽ (Clear Canvas)

*   **File chính:** `js/canvas/canvasContext.js` (hàm `clearDrawingArea`), `js/ui/toolbarController.js`
*   **Hoạt động:**
    *   Khi nút "Clear" trên toolbar được nhấp và người dùng xác nhận:
        *   `clearDrawingArea()` được gọi, sử dụng `ctx.clearRect(0, 0, canvas.width, canvas.height)` để xóa toàn bộ nội dung canvas.
        *   `resetUndoRedoHistory(getCanvas())` được gọi để xóa lịch sử và ghi lại trạng thái trống mới làm điểm bắt đầu cho Undo.

### Hướng dẫn lần đầu

*   **Files chính:** `js/ui/firstRunGuide.js`, `js/utils/storage.js`
*   **Hoạt động:**
    *   Khi tiện ích được kích hoạt lần đầu (`enableExtension` trong `main.js`):
        *   `checkAndShowFirstRunGuide()` được gọi.
        *   Hàm này sử dụng `storage.js` (wrapper cho `chrome.storage.local`) để kiểm tra xem khóa `STORAGE_KEY_GUIDE_SEEN` đã được đặt chưa.
        *   Nếu chưa:
            *   Tạo (nếu chưa có) và hiển thị một modal HTML (`#overdraw-guide-modal`) với các hướng dẫn cơ bản.
        *   Khi người dùng nhấp nút "Got it!" trên modal:
            *   Modal được ẩn.
            *   Khóa `STORAGE_KEY_GUIDE_SEEN` được đặt thành `true` trong `chrome.storage.local` để không hiển thị lại ở các lần sau.

## Đóng góp

Chào mừng mọi đóng góp! Vui lòng tạo Pull Request hoặc mở Issue để thảo luận về các thay đổi hoặc tính năng mới.

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE.txt) (Bạn cần tạo file LICENSE.txt nếu muốn).

## Building the Extension

This project uses ES module syntax, which is not supported directly in Chrome extension content scripts. You must bundle the code before loading the extension in Chrome.

### Prerequisites
- [Node.js](https://nodejs.org/) installed

### Install dependencies
```
npm install --save-dev esbuild
```

### Build the bundle
```
node build.js
```

This will generate `dist/bundle.js`. The extension is now ready to load in Chrome.

If you make changes to the JS files, re-run the build command above.

---
```
