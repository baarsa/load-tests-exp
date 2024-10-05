import cluster from "cluster";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {ClusterScaleController} from "./utils/ClusterScaleController.js";
import {Autoscaler} from "./utils/Autoscaler.js";
import {CpuScaleCondition} from "./utils/CpuScaleCondition.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

cluster.setupPrimary({
    exec: __dirname + "/index.js",
});

const scaleController = new ClusterScaleController();
const conditions = [new CpuScaleCondition()];
(new Autoscaler({
    checkIntervalMs: 1000,
    conditions,
    controller: scaleController
})).run();
