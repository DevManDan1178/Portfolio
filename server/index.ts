import express from "express";
import leaderboardHandler from "./api/leaderboard";
import nameboardHandler from "./api/nameboard"
import scoreStreamHandler from "./api/scoreStream"
import "dotenv/config";
import { leaderboardApiURLPath } from "../shared/types/api/globalBoards/leaderboard";
import { scoreStreamApiURLPath } from "../shared/types/api/globalBoards/scoreStreams";
import { nameboardApiURLPath } from "../shared/types/api/globalBoards/nameboard";

const app = express();

app.use(express.json());

app.all(`${leaderboardApiURLPath}`, async (req, res) => {
    const response = await leaderboardHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});

app.all(`${nameboardApiURLPath}`, async (req, res) => {
    const response = await nameboardHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});

app.all(`${scoreStreamApiURLPath}`, async (req, res) => {
    const response = await scoreStreamHandler(
        new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: JSON.stringify(req.body),
        })
    );

    const data = await response.json();

    res.status(response.status).json(data);
});


app.listen(3001, () => {
    console.log("API server running on port 3001");
});