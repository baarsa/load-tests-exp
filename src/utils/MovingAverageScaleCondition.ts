import {ScaleCondition} from "./interfaces/ScaleCondition.js";
import MovingAverage from "moving-average";

const DEFAULT_PERIOD = 100;
const DEFAULT_LENGTH = 10_000;

export class MovingAverageScaleCondition implements ScaleCondition {
    private readonly getCurrentValue: () => number;
    private readonly lowValue: number;
    private readonly highValue: number;
    private readonly periodMs: number;
    private readonly maLength: number;
    private interval: NodeJS.Timeout | null = null;
    private ma: MovingAverage;

    constructor(params: {
        getCurrentValue: () => number,
        lowValue: number,
        highValue: number,
        periodMs?: number,
        maLength?: number,
    }) {
        this.getCurrentValue = params.getCurrentValue;
        this.lowValue = params.lowValue;
        this.highValue = params.highValue;
        this.periodMs = params.periodMs ?? DEFAULT_PERIOD;
        this.maLength = params.maLength ?? DEFAULT_LENGTH; // TODO clean;
        this.ma = MovingAverage(this.maLength)
    }

    init() {
        this.interval = setInterval(() => {
            this.ma.push(Date.now(), this.getCurrentValue());
        }, this.periodMs);
    }

    stop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    }

    needDownscale(): boolean {
        return this.ma.movingAverage() < this.lowValue;
    }

    needUpscale(): boolean {
        return this.ma.movingAverage() > this.highValue;
    }
}