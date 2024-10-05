import {ScaleCondition} from "./interfaces/ScaleCondition.js";

export class EmptyScaleCondition implements ScaleCondition {
    needUpscale(): boolean {
        return false;
    }

    needDownscale(): boolean {
        return false;
    }
}