import express from "express";
import leaderboardHandler from "./api/leaderboard";
import nameboardHandler from "./api/nameboard"
import scoreStreamHandler from "./api/scoreStream"
import "dotenv/config";
import { leaderboardApiURLPath, nameboardApiURLPath, scoreStreamApiURLPath } from "../shared/constants/api/globalBoards";
import { Request } from "express";

const app = express();

app.use(express.json());

function getReq(req : Request) : globalThis.Request {
    return new globalThis.Request(
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