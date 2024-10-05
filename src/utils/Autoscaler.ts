import {ScaleCondition} from "./interfaces/ScaleCondition.js";
import {ScaleController} from "./interfaces/ScaleController.js";

export class Autoscaler {
    private checkIntervalMs: number;
    private conditions: ScaleCondition[];
    private scaleController: ScaleController;
    private interval: NodeJS.Timeout | null = null;

    constructor({
        checkIntervalMs,
        conditions,
        controller
                }: {
        checkIntervalMs: number;
        conditions: ScaleCondition[];
        controller: ScaleController;
    }) {
        this.checkIntervalMs = checkIntervalMs;
        this.conditions = conditions;
        this.scaleController = controller;
    }

    run() {
        this.interval = setInterval(() => {
            if (this.scaleController.canUpscale()
                && this.conditions.reduce((acc, condition) => acc || condition.needUpscale(), false)) {
                this.scaleController.upscale();
                return;
            }
            if (this.scaleController.canDownscale()
                && this.conditions.reduce((acc, condition) => acc && condition.needDownscale(), true)) {
                this.scaleController.downscale();
                return;
            }
        }, this.checkIntervalMs);
    }

    stop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }
}