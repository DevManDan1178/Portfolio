import express from "express";
import leaderboardHandler from "./api/leaderboard";
import nameboardHandler from "./api/nameboard"
import scoreStreamHandler from "./api/scoreStream"
import "dotenv/config";
import { leaderboardApiURLPath } from "../shared/types/api/globalBoards/leaderboard";
import { scoreStreamApiURLPath } from "../shared/types/api/globalBoards/scoreStreams";
import { nameboardApiURLPath } from "../shared/types/api/globalBoards/nameboard";
import { Request, Response } from "express";

const app = express();

app.use(express.json());

function getReq(req : Request) : globalThis.Request {
    return new Request(
        `http://${req.headers.host}${req.url}`,
        {
            method: req.method,
            headers: {
                "Content-Type": req.headers["content-type"] ?? "application/json",
            },
            body: JSON.stringify(req.body)
        }
    )
}
app.all(`${leaderboardApiURLPath}`, async (req, res) => {
    const request = getReq(req);
    const response = await leaderboardHandler(request);
    const data = await response.json();

    res.status(response.status).json(data);
});

app.all(`${nameboardApiURLPath}`, async (req, res) => {
    const request = getReq(req);
    const response = await nameboardHandler(request);

    const data = await response.json();

    res.status(response.status).json(data);
});

app.all(`${scoreStreamApiURLPath}`, async (req, res) => {
    const request = getReq(req);
    const response = await scoreStreamHandler(request);

    const data = await response.json();

    res.status(response.status).json(data);
});


app.listen(3001, () => {
    console.log("API server running on port 3001");
});