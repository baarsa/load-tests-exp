import express from "express";

const port = 3000;
const app = express();

console.log(`worker pid=${process.pid}`);

function getMs([sec, nano]) {
    return sec * 1000 + nano / 1000000;
}

app.get("/work", (req, res) => {
    const start = process.hrtime();
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) {
        total++;
    }
    const diff = process.hrtime(start);
    if (typeof process.send === "function") {
        process.send(`${getMs(diff)}`);
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
});

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

process.on('message', (message) => {
    console.log(`worker received a message ${message}`);
    if (message === 'shutdown') {
        console.log(`Worker ${process.pid} is shutting down...`);
        server.close(() => {
            process.exit(0);
        });
    }
});
