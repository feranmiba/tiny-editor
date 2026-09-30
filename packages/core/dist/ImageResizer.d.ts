/**
 * Re-encodes an HTMLImageElement to a new Base64 Data URL at target dimensions
 * using multi-pass step-down downscaling + HiDPI (Retina) DPR scaling for high sharpness.
 */
export declare function reencodeImageBase64(img: HTMLImageElement, targetWidth: number, targetHeight: number, dpr?: number): Promise<string>;
/**
 * Crops an HTMLImageElement to a specified sub-rectangle (cropX, cropY, cropWidth, cropHeight)
 * and returns the cropped image as a Base64 Data URL.
 */
export declare function cropImageBase64(img: HTMLImageElement, cropX: number, cropY: number, cropWidth: number, cropHeight: number, dpr?: number): Promise<string>;
/**
 * Interactive Image Resizer & Cropper Manager for light-text-editor.
 */
export declare class ImageResizer {
    private editorElement;
    private selectedImg;
    private overlay;
    private badge;
    private isDragging;
    private activeHandle;
    private startX;
    private startY;
    private startWidth;
    private startHeight;
    private aspectRatio;
    private isCropping;
    private cropOverlay;
    private cropBox;
    private cropX;
    private cropY;
    private cropW;
    private cropH;
    constructor(editorElement: HTMLElement);
    private injectStyles;
    private initEvents;
    selectImage(img: HTMLImageElement): void;
    deselectImage(): void;
    deleteSelectedImage(): void;
    setImageAlignment(align: 'left' | 'center' | 'right'): void;
    private createOverlay;
    private updateOverlayPosition;
    private updateBadgeText;
    private applyPresetScale;
    private startDrag;
    private onDrag;
    private endDrag;
    private applyNewDimensions;
    private startCropMode;
    private updateCropBoxStyle;
    private applyCrop;
    private stopCropMode;
}
