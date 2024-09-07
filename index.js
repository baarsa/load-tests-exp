import express from "express";

const port = 3000;
const app = express();

console.log(`worker pid=${process.pid}`);
// todo abstract from express

app.get("/work", (req, res) => {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) {
        total++;
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
});

app.post("/work2", (req, res) => {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) {
        total++;
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
