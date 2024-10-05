
export interface ScaleCondition {
    needUpscale(): boolean;
    needDownscale(): boolean;
}