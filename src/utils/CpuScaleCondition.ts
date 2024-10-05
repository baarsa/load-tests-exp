import os from 'os';
import {ScaleCondition} from "./interfaces/ScaleCondition.js";

export class CpuScaleCondition implements ScaleCondition {
    private readonly upscaleThreshold: number;
    private readonly downscaleThreshold: number;

    constructor(upscaleThreshold: number = 75, downscaleThreshold: number = 40) {
        this.upscaleThreshold = upscaleThreshold;
        this.downscaleThreshold = downscaleThreshold;
    }

    private getCpuUsage(): number {
        const cpus = os.cpus();
        let idle = 0, total = 0;

        cpus.forEach((cpu) => {
            for (let type in cpu.times) {
                // @ts-ignore
                total += cpu.times[type];
                // @ts-ignore
            }
            idle += cpu.times.idle;
        });
        return 100 - Math.round(100 * idle / total);
    }

    needUpscale(): boolean {
        return this.getCpuUsage() > this.upscaleThreshold;
    }

    needDownscale(): boolean {
        return this.getCpuUsage() < this.downscaleThreshold;
    }
}
