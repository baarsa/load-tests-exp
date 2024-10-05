import {ScaleController} from "./interfaces/ScaleController.js";
import os from "os";
import cluster from "cluster";

const MIN_WORKERS = 3;

export class ClusterScaleController implements ScaleController {
    private cpuCount = os.cpus().length;

    constructor() {
        for (let i = 0; i < MIN_WORKERS; i++) {
            this.upscale();
        }
    }

    private numWorkers() {
        return Object.values(cluster.workers ?? []).length;
    }

    canDownscale(): boolean {
        return this.numWorkers() > MIN_WORKERS;
    }

    canUpscale(): boolean {
        return this.numWorkers() < this.cpuCount;
    }

    downscale() {
        const firstWorker = Object.values(cluster.workers ?? [])[0];
        firstWorker?.send('shutdown');
    }

    upscale() {
        const child = cluster.fork(); // TODO: add ProcessFork interface with subscriptions
        // child.on('message', (m) => {
        //     const n = Number(m);
        //     ma.push(Date.now(), n);
        //     console.log(`average time of request: ${ma.movingAverage()}ms`);
        // });
    }
}