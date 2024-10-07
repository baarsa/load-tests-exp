import fs from 'fs';
import Table from 'cli-table3';
var singleReport = JSON.parse(fs.readFileSync('./benchmark-single.json', 'utf8'));
var clusterReport = JSON.parse(fs.readFileSync('./benchmark-cluster.json', 'utf8'));
var pmReport = JSON.parse(fs.readFileSync('./benchmark-pm.json', 'utf8'));

const singleLatency= singleReport.latency;
const clusterLatency = clusterReport.latency;
const pmLatency = pmReport.latency;
const table = new Table({ head: ['', 'Min', 'Max', 'Average', 'p99'] });
table.push(
    {
        'Single': [singleLatency.min, singleLatency.max, singleLatency.average, singleLatency.p99],
    },
    {
        'Cluster': [clusterLatency.min, clusterLatency.max, clusterLatency.average, clusterLatency.p99],
    },
    {
        'PM2': [pmLatency.min, pmLatency.max, pmLatency.average, pmLatency.p99],
    },
);

console.log(table.toString());