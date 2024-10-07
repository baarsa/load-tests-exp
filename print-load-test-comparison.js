import fs from 'fs';
import Table from 'cli-table3';
var singleReport = JSON.parse(fs.readFileSync('./tests/report-single.json', 'utf8'));
var clusterReport = JSON.parse(fs.readFileSync('./tests/report-cluster.json', 'utf8'));
var pmReport = JSON.parse(fs.readFileSync('./tests/report-pm.json', 'utf8'));

const singleTimes = singleReport.aggregate.summaries["http.response_time"];
const clusterTimes = clusterReport.aggregate.summaries["http.response_time"];
const pmTimes = pmReport.aggregate.summaries["http.response_time"];
const table = new Table({ head: ['', 'Min', 'Max', 'Median', 'p99'] });
table.push(
    {
        'Single': [singleTimes.min, singleTimes.max, singleTimes.median, singleTimes.p99],
    },
    {
        'Cluster': [clusterTimes.min, clusterTimes.max, clusterTimes.median, clusterTimes.p99],
    },
    {
        'PM2': [pmTimes.min, pmTimes.max, pmTimes.median, pmTimes.p99],
    },
);

console.log(table.toString());