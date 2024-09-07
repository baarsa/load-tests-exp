import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MIN_CPUS = 3;
const LOAD_THRESHOLD_PERCENT = 70;
const CHECK_PERIOD_MS = 1500;

const cpuCount = os.cpus().length;

console.log(`The total number of CPUs is ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
    exec: __dirname + "/index.js",
});

for (let i = 0; i < MIN_CPUS; i++) {
    cluster.fork();
}

let previousUsage = process.cpuUsage();
let timestamp = Date.now();

function monitorCPU() {
    const currentUsage = process.cpuUsage(previousUsage);
    const currentTimestamp = Date.now();
    const cpuPercent = 100 * (currentUsage.user + currentUsage.system) / 1000 / (currentTimestamp - timestamp);
    console.log(`usage: ${currentUsage.user}, ${currentUsage.system}`);
    console.log(`CPU usage: ${cpuPercent.toFixed(2)}%`);

    // Assume that we add a new worker if CPU usage is more than 70% of the max for each CPU
    // if (cpuPercent > 70) {
    //     console.log('High CPU usage detected, adding a new worker...');
    //     cluster.fork();
    // }

    // Update previous usage for the next interval
    previousUsage = process.cpuUsage();
    timestamp = currentTimestamp;
}

setInterval(monitorCPU, CHECK_PERIOD_MS);

cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} has been killed`);
    console.log("Starting another worker");
    cluster.fork();
});