/**
 * Re-encodes an HTMLImageElement to a new Base64 Data URL at target dimensions
 * using multi-pass step-down downscaling + HiDPI (Retina) DPR scaling for high sharpness.
 */
export function reencodeImageBase64(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  dpr: number = Math.max(2, window.devicePixelRatio || 2)
): Promise<string> {
  return new Promise((resolve) => {
    const process = () => {
      let mimeType = 'image/png';
      if (img.src && img.src.startsWith('data:')) {
        const match = img.src.match(/^data:(image\/[a-zA-Z+]+);base64,/);
        if (match) {
          mimeType = match[1];
        }
      }

      const renderW = Math.max(1, Math.round(targetWidth * dpr));
      const renderH = Math.max(1, Math.round(targetHeight * dpr));

      let curW = img.naturalWidth || img.width || renderW;
      let curH = img.naturalHeight || img.height || renderH;

      let curCanvas = document.createElement('canvas');
      curCanvas.width = curW;
      curCanvas.height = curH;
      let ctx = curCanvas.getContext('2d');
      if (!ctx) {
        resolve(img.src);
        return;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, curW, curH);

      while (curW / 2 >= renderW && curH / 2 >= renderH) {
        const nextW = Math.floor(curW / 2);
        const nextH = Math.floor(curH / 2);

        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = nextW;
        nextCanvas.height = nextH;
        const nextCtx = nextCanvas.getContext('2d');
        if (nextCtx) {
          nextCtx.imageSmoothingEnabled = true;
          nextCtx.imageSmoothingQuality = 'high';
          nextCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);
        }
        curCanvas = nextCanvas;
        curW = nextW;
        curH = nextH;
      }

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = renderW;
      finalCanvas.height = renderH;
      const finalCtx = finalCanvas.getContext('2d');
      if (finalCtx) {
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, renderW, renderH);

        try {
          const newSrc = finalCanvas.toDataURL(mimeType, 0.95);
          resolve(newSrc);
          return;
        } catch (e) {
          console.warn('Failed to re-encode image base64:', e);
        }
      }
      resolve(img.src);
    };

    if (img.complete && img.naturalWidth !== 0) {
      process();
    } else {
      const origOnload = img.onload;
      img.onload = (e) => {
        if (origOnload) origOnload.call(img, e);
        process();
      };
    }
  });
}

/**
 * Crops an HTMLImageElement to a specified sub-rectangle (cropX, cropY, cropWidth, cropHeight)
 * and returns the cropped image as a Base64 Data URL.
 */
export function cropImageBase64(
  img: HTMLImageElement,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number,
  dpr: number = Math.max(2, window.devicePixelRatio || 2)
): Promise<string> {
  return new Promise((resolve) => {
    const process = () => {
      let mimeType = 'image/png';
      if (img.src && img.src.startsWith('data:')) {
        const match = img.src.match(/^data:(image\/[a-zA-Z+]+);base64,/);
        if (match) {
          mimeType = match[1];
        }
      }

      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;
      const displayW = img.clientWidth || naturalW;
      const displayH = img.clientHeight || naturalH;

      const scaleX = naturalW / (displayW || 1);
      const scaleY = naturalH / (displayH || 1);

      const sx = Math.max(0, Math.round(cropX * scaleX));
      const sy = Math.max(0, Math.round(cropY * scaleY));
      const sw = Math.min(naturalW - sx, Math.round(cropWidth * scaleX));
      const sh = Math.min(naturalH - sy, Math.round(cropHeight * scaleY));

      if (sw <= 0 || sh <= 0) {
        resolve(img.src);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(sw * dpr);
      canvas.height = Math.round(sh * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

        try {
          const croppedBase64 = canvas.toDataURL(mimeType, 0.95);
          resolve(croppedBase64);
          return;
        } catch (e) {
          console.warn('Failed to crop image base64:', e);
        }
      }
      resolve(img.src);
    };

    if (img.complete && img.naturalWidth !== 0) {
      process();
    } else {
      const origOnload = img.onload;
      img.onload = (e) => {
        if (origOnload) origOnload.call(img, e);
        process();
      };
    }
  });
}

/**
 * Interactive Image Resizer & Cropper Manager for light-text-editor.
 */
export class ImageResizer {
  private editorElement: HTMLElement;
  private selectedImg: HTMLImageElement | null = null;
  private overlay: HTMLElement | null = null;
  private badge: HTMLElement | null = null;
  private isDragging = false;
  private activeHandle: string | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private aspectRatio = 1;

  // Crop Mode State
  private isCropping = false;
  private cropOverlay: HTMLElement | null = null;
  private cropBox: HTMLElement | null = null;
  private cropX = 0;
  private cropY = 0;
  private cropW = 0;
  private cropH = 0;

  constructor(editorElement: HTMLElement) {
    this.editorElement = editorElement;
    this.initEvents();
    this.injectStyles();
  }

  private injectStyles(): void {
    if (document.getElementById('tiny-editor-resizer-styles')) return;
    const style = document.createElement('style');
    style.id = 'tiny-editor-resizer-styles';
    style.textContent = `
      .tiny-editor-resizer-overlay {
        position: absolute;
        border: 2px dashed #4f46e5;
        box-sizing: border-box;
        pointer-events: none;
        z-index: 1000;
        border-radius: 4px;
      }
      .tiny-editor-resize-handle {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #4f46e5;
        border: 2px solid #ffffff;
        border-radius: 50%;
        pointer-events: auto;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      }
      .tiny-editor-handle-nw { top: -6px; left: -6px; cursor: nwse-resize; }
      .tiny-editor-handle-ne { top: -6px; right: -6px; cursor: nesw-resize; }
      .tiny-editor-handle-sw { bottom: -6px; left: -6px; cursor: nesw-resize; }
      .tiny-editor-handle-se { bottom: -6px; right: -6px; cursor: nwse-resize; }

      .tiny-editor-resizer-toolbar {
        position: absolute;
        top: -42px;
        left: 50%;
        transform: translateX(-50%);
        background: #18181b;
        color: #ffffff;
        padding: 4px 8px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        pointer-events: auto;
        white-space: nowrap;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      }
      .tiny-editor-resizer-btn {
        background: #27272a;
        color: #e4e4e7;
        border: 1px solid #3f3f46;
        padding: 3px 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        transition: background 0.12s, border-color 0.12s;
      }
      .tiny-editor-resizer-btn:hover {
        background: #4f46e5;
        color: #ffffff;
        border-color: #6366f1;
      }
      .tiny-editor-resizer-btn-success {
        background: #059669;
        border-color: #10b981;
        color: #ffffff;
      }
      .tiny-editor-resizer-btn-success:hover {
        background: #047857;
        border-color: #059669;
      }
      .tiny-editor-resizer-btn-danger:hover {
        background: #dc2626;
        border-color: #ef4444;
      }
      .tiny-editor-resizer-sep {
        width: 1px;
        height: 16px;
        background: #3f3f46;
        margin: 0 2px;
      }
      .tiny-editor-resizer-badge {
        color: #a1a1aa;
        font-size: 11px;
        padding: 0 4px;
      }

      /* Crop Overlay Styles */
      .tiny-editor-crop-overlay {
        position: absolute;
        background: rgba(0, 0, 0, 0.4);
        pointer-events: auto;
        z-index: 1001;
      }
      .tiny-editor-crop-box {
        position: absolute;
        border: 2px dashed #10b981;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45);
        cursor: move;
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
  }

  private initEvents(): void {
    this.editorElement.addEventListener('click', (e) => {
      if (this.isCropping) return;
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        this.selectImage(target as HTMLImageElement);
      } else if (!this.isDragging && (!this.overlay || !this.overlay.contains(target))) {
        this.deselectImage();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (!this.selectedImg || this.isCropping) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        this.deleteSelectedImage();
      }
    });

    window.addEventListener('resize', () => {
      if (this.selectedImg && !this.isCropping) this.updateOverlayPosition();
    });

    document.addEventListener('scroll', () => {
      if (this.selectedImg && !this.isCropping) this.updateOverlayPosition();
    }, true);
  }

  public selectImage(img: HTMLImageElement): void {
    this.deselectImage();
    this.selectedImg = img;
    this.createOverlay();
    this.updateOverlayPosition();
  }

  public deselectImage(): void {
    if (this.isCropping) {
      this.stopCropMode();
    }
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.selectedImg = null;
  }

  public deleteSelectedImage(): void {
    if (!this.selectedImg) return;
    this.selectedImg.remove();
    this.deselectImage();
    this.editorElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  public setImageAlignment(align: 'left' | 'center' | 'right'): void {
    if (!this.selectedImg) return;
    const img = this.selectedImg;
    const parentBlock = img.parentElement;

    img.style.display = 'block';

    if (align === 'left') {
      img.style.marginLeft = '0';
      img.style.marginRight = 'auto';
      img.style.float = 'none';
      if (parentBlock && parentBlock !== this.editorElement) {
        parentBlock.style.textAlign = 'left';
      }
    } else if (align === 'center') {
      img.style.marginLeft = 'auto';
      img.style.marginRight = 'auto';
      img.style.float = 'none';
      if (parentBlock && parentBlock !== this.editorElement) {
        parentBlock.style.textAlign = 'center';
      }
    } else if (align === 'right') {
      img.style.marginLeft = 'auto';
      img.style.marginRight = '0';
      img.style.float = 'none';
      if (parentBlock && parentBlock !== this.editorElement) {
        parentBlock.style.textAlign = 'right';
      }
    }

    this.updateOverlayPosition();
    this.editorElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private createOverlay(): void {
    if (!this.selectedImg) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'tiny-editor-resizer-overlay';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'tiny-editor-resizer-toolbar';

    // Alignment buttons
    const aligns: Array<{ label: string; value: 'left' | 'center' | 'right'; icon: string }> = [
      { label: 'Left', value: 'left', icon: '⬅️' },
      { label: 'Center', value: 'center', icon: '↔️' },
      { label: 'Right', value: 'right', icon: '➡️' },
    ];

    aligns.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'tiny-editor-resizer-btn';
      btn.innerHTML = `${item.icon}`;
      btn.title = `Align ${item.label}`;
      btn.type = 'button';
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setImageAlignment(item.value);
      });
      toolbar.appendChild(btn);
    });

    const sep1 = document.createElement('div');
    sep1.className = 'tiny-editor-resizer-sep';
    toolbar.appendChild(sep1);

    // Scale presets
    const presets = [
      { label: '25%', factor: 0.25 },
      { label: '50%', factor: 0.5 },
      { label: '75%', factor: 0.75 },
      { label: '100%', factor: 1.0 },
    ];

    presets.forEach((preset) => {
      const btn = document.createElement('button');
      btn.className = 'tiny-editor-resizer-btn';
      btn.textContent = preset.label;
      btn.type = 'button';
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.applyPresetScale(preset.factor);
      });
      toolbar.appendChild(btn);
    });

    const sep2 = document.createElement('div');
    sep2.className = 'tiny-editor-resizer-sep';
    toolbar.appendChild(sep2);

    // Crop / Cut Region button
    const cropBtn = document.createElement('button');
    cropBtn.className = 'tiny-editor-resizer-btn';
    cropBtn.innerHTML = '✂️ Cut / Crop';
    cropBtn.title = 'Crop / Cut section of image';
    cropBtn.type = 'button';
    cropBtn.addEventListener('mousedown', (e) => e.preventDefault());
    cropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.startCropMode();
    });
    toolbar.appendChild(cropBtn);

    // Delete image button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'tiny-editor-resizer-btn tiny-editor-resizer-btn-danger';
    deleteBtn.innerHTML = '🗑️ Remove';
    deleteBtn.title = 'Remove image from document';
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('mousedown', (e) => e.preventDefault());
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteSelectedImage();
    });
    toolbar.appendChild(deleteBtn);

    this.badge = document.createElement('span');
    this.badge.className = 'tiny-editor-resizer-badge';
    toolbar.appendChild(this.badge);

    this.overlay.appendChild(toolbar);

    // Corner Handles
    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach((dir) => {
      const handle = document.createElement('div');
      handle.className = `tiny-editor-resize-handle tiny-editor-handle-${dir}`;
      handle.addEventListener('mousedown', (e) => this.startDrag(e, dir));
      this.overlay!.appendChild(handle);
    });

    document.body.appendChild(this.overlay);
    this.updateBadgeText();
  }

  private updateOverlayPosition(): void {
    if (!this.selectedImg || !this.selectedImg.isConnected || !this.overlay || this.isCropping) {
      if (!this.isCropping) this.deselectImage();
      return;
    }
    const rect = this.selectedImg.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    this.overlay.style.width = `${rect.width}px`;
    this.overlay.style.height = `${rect.height}px`;
    this.overlay.style.left = `${rect.left + scrollX}px`;
    this.overlay.style.top = `${rect.top + scrollY}px`;

    this.updateBadgeText();
  }

  private updateBadgeText(): void {
    if (!this.selectedImg || !this.badge) return;
    const width = Math.round(this.selectedImg.getBoundingClientRect().width || this.selectedImg.clientWidth);
    const height = Math.round(this.selectedImg.getBoundingClientRect().height || this.selectedImg.clientHeight);
    this.badge.textContent = `${width} × ${height} px`;
  }

  private async applyPresetScale(factor: number): Promise<void> {
    if (!this.selectedImg) return;
    const naturalW = this.selectedImg.naturalWidth || this.selectedImg.width || 300;
    const naturalH = this.selectedImg.naturalHeight || this.selectedImg.height || 200;

    const targetW = Math.round(naturalW * factor);
    const targetH = Math.round(naturalH * factor);

    await this.applyNewDimensions(targetW, targetH);
  }

  private startDrag(e: MouseEvent, dir: string): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.selectedImg) return;

    this.isDragging = true;
    this.activeHandle = dir;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const rect = this.selectedImg.getBoundingClientRect();
    this.startWidth = rect.width;
    this.startHeight = rect.height;
    this.aspectRatio = this.startWidth / (this.startHeight || 1);

    const onMouseMove = (me: MouseEvent) => this.onDrag(me);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      this.endDrag();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  private onDrag(e: MouseEvent): void {
    if (!this.isDragging || !this.selectedImg) return;

    const dx = e.clientX - this.startX;
    let newWidth = this.startWidth;

    if (this.activeHandle === 'se' || this.activeHandle === 'ne') {
      newWidth = this.startWidth + dx;
    } else if (this.activeHandle === 'sw' || this.activeHandle === 'nw') {
      newWidth = this.startWidth - dx;
    }

    newWidth = Math.max(20, newWidth);
    const newHeight = Math.max(20, Math.round(newWidth / this.aspectRatio));

    this.selectedImg.style.width = `${newWidth}px`;
    this.selectedImg.style.height = `${newHeight}px`;

    this.updateOverlayPosition();
  }

  private async endDrag(): Promise<void> {
    if (!this.isDragging || !this.selectedImg) return;
    this.isDragging = false;

    const rect = this.selectedImg.getBoundingClientRect();
    const finalW = Math.round(rect.width);
    const finalH = Math.round(rect.height);

    await this.applyNewDimensions(finalW, finalH);
  }

  private async applyNewDimensions(width: number, height: number): Promise<void> {
    if (!this.selectedImg) return;

    if (this.badge) {
      this.badge.textContent = `Re-encoding base64...`;
    }

    const newBase64 = await reencodeImageBase64(this.selectedImg, width, height);
    this.selectedImg.src = newBase64;
    this.selectedImg.style.width = `${width}px`;
    this.selectedImg.style.height = `${height}px`;

    this.updateOverlayPosition();

    this.editorElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /* ─────────────────────────────────────────────────────────────
     Interactive Crop / Cut Area Mode
     ───────────────────────────────────────────────────────────── */

  private startCropMode(): void {
    if (!this.selectedImg) return;

    this.isCropping = true;

    // Remove standard overlay temporarily
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }

    const rect = this.selectedImg.getBoundingClientRect();
    const scrollX = window.scrollX || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Crop Overlay matching image bounds
    this.cropOverlay = document.createElement('div');
    this.cropOverlay.className = 'tiny-editor-crop-overlay';
    this.cropOverlay.style.left = `${rect.left + scrollX}px`;
    this.cropOverlay.style.top = `${rect.top + scrollY}px`;
    this.cropOverlay.style.width = `${rect.width}px`;
    this.cropOverlay.style.height = `${rect.height}px`;

    // Initialize crop box to 80% of image size centered
    const marginW = rect.width * 0.1;
    const marginH = rect.height * 0.1;

    this.cropX = marginW;
    this.cropY = marginH;
    this.cropW = rect.width * 0.8;
    this.cropH = rect.height * 0.8;

    // Crop Box
    this.cropBox = document.createElement('div');
    this.cropBox.className = 'tiny-editor-crop-box';
    this.updateCropBoxStyle();

    // Make crop box draggable
    let isDraggingBox = false;
    let boxStartX = 0;
    let boxStartY = 0;
    let initialCropX = 0;
    let initialCropY = 0;

    this.cropBox.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDraggingBox = true;
      boxStartX = e.clientX;
      boxStartY = e.clientY;
      initialCropX = this.cropX;
      initialCropY = this.cropY;

      const onBoxMove = (me: MouseEvent) => {
        if (!isDraggingBox) return;
        const dx = me.clientX - boxStartX;
        const dy = me.clientY - boxStartY;

        this.cropX = Math.max(0, Math.min(rect.width - this.cropW, initialCropX + dx));
        this.cropY = Math.max(0, Math.min(rect.height - this.cropH, initialCropY + dy));

        this.updateCropBoxStyle();
      };

      const onBoxUp = () => {
        isDraggingBox = false;
        window.removeEventListener('mousemove', onBoxMove);
        window.removeEventListener('mouseup', onBoxUp);
      };

      window.addEventListener('mousemove', onBoxMove);
      window.addEventListener('mouseup', onBoxUp);
    });

    // Add Crop Corner Handles
    const dirs = ['nw', 'ne', 'sw', 'se'];
    dirs.forEach((dir) => {
      const handle = document.createElement('div');
      handle.className = `tiny-editor-resize-handle tiny-editor-handle-${dir}`;
      handle.style.background = '#10b981';

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const handleStartX = e.clientX;
        const handleStartY = e.clientY;
        const startX = this.cropX;
        const startY = this.cropY;
        const startW = this.cropW;
        const startH = this.cropH;

        const onHandleMove = (me: MouseEvent) => {
          const dx = me.clientX - handleStartX;
          const dy = me.clientY - handleStartY;

          if (dir === 'se') {
            this.cropW = Math.max(20, Math.min(rect.width - startX, startW + dx));
            this.cropH = Math.max(20, Math.min(rect.height - startY, startH + dy));
          } else if (dir === 'sw') {
            const newW = Math.max(20, Math.min(startX + startW, startW - dx));
            this.cropX = startX + (startW - newW);
            this.cropW = newW;
            this.cropH = Math.max(20, Math.min(rect.height - startY, startH + dy));
          } else if (dir === 'ne') {
            this.cropW = Math.max(20, Math.min(rect.width - startX, startW + dx));
            const newH = Math.max(20, Math.min(startY + startH, startH - dy));
            this.cropY = startY + (startH - newH);
            this.cropH = newH;
          } else if (dir === 'nw') {
            const newW = Math.max(20, Math.min(startX + startW, startW - dx));
            this.cropX = startX + (startW - newW);
            this.cropW = newW;

            const newH = Math.max(20, Math.min(startY + startH, startH - dy));
            this.cropY = startY + (startH - newH);
            this.cropH = newH;
          }

          this.updateCropBoxStyle();
        };

        const onHandleUp = () => {
          window.removeEventListener('mousemove', onHandleMove);
          window.removeEventListener('mouseup', onHandleUp);
        };

        window.addEventListener('mousemove', onHandleMove);
        window.addEventListener('mouseup', onHandleUp);
      });

      this.cropBox!.appendChild(handle);
    });

    // Crop Toolbar (Apply / Cancel)
    const toolbar = document.createElement('div');
    toolbar.className = 'tiny-editor-resizer-toolbar';

    const applyBtn = document.createElement('button');
    applyBtn.className = 'tiny-editor-resizer-btn tiny-editor-resizer-btn-success';
    applyBtn.innerHTML = '✓ Apply Cut / Crop';
    applyBtn.type = 'button';
    applyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.applyCrop();
    });
    toolbar.appendChild(applyBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'tiny-editor-resizer-btn';
    cancelBtn.innerHTML = '✕ Cancel';
    cancelBtn.type = 'button';
    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.stopCropMode();
    });
    toolbar.appendChild(cancelBtn);

    this.cropOverlay.appendChild(toolbar);
    this.cropOverlay.appendChild(this.cropBox);
    document.body.appendChild(this.cropOverlay);
  }

  private updateCropBoxStyle(): void {
    if (!this.cropBox) return;
    this.cropBox.style.left = `${this.cropX}px`;
    this.cropBox.style.top = `${this.cropY}px`;
    this.cropBox.style.width = `${this.cropW}px`;
    this.cropBox.style.height = `${this.cropH}px`;
  }

  private async applyCrop(): Promise<void> {
    if (!this.selectedImg) return;

    const img = this.selectedImg;

    // Crop Image Base64
    const croppedBase64 = await cropImageBase64(
      img,
      this.cropX,
      this.cropY,
      this.cropW,
      this.cropH
    );

    img.src = croppedBase64;
    img.style.width = `${Math.round(this.cropW)}px`;
    img.style.height = `${Math.round(this.cropH)}px`;

    this.stopCropMode();
    this.selectImage(img);

    this.editorElement.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private stopCropMode(): void {
    this.isCropping = false;
    if (this.cropOverlay) {
      this.cropOverlay.remove();
      this.cropOverlay = null;
      this.cropBox = null;
    }
  }
}
