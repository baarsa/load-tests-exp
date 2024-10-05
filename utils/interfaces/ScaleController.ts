
export interface ScaleController {
    canUpscale(): boolean;
    canDownscale(): boolean;
    upscale(): void;
    downscale(): void;
}