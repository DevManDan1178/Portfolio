import express from "express";
import leaderboardHandler from "./api/leaderboard";
import nameboardHandler from "./api/nameboard"
import scoreStreamHandler from "./api/scoreStream"
import "dotenv/config";

const app = express();

app.use(express.json());

app.all("/api/leaderboard", async (req, res) => {
    const response = await leaderboardHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" ? undefined : JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});

app.all("/api/nameboard", async (req, res) => {
    const response = await nameboardHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" ? undefined : JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});

app.all("/api/score-stream", async (req, res) => {
    const response = await scoreStreamHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" ? undefined : JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});


app.listen(3001, () => {
    console.log("API server running on port 3001");
});