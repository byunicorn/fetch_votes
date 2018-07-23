const express = require("express");
const creep = require("./creep");
const _ = require("lodash");
let { QUERY_INTERVAL } = require("./const");
QUERY_INTERVAL = Math.floor(QUERY_INTERVAL / 1000);

const app = express();
const records = creep();

app.get("/votes", (req, res) => {
    let data = [];
    const { start, end } = req.query;
    const default_val = { timestamp: Math.floor(Date.now() / 1000) };

    const first = (_.first(records) || default_val).timestamp;
    const last = (_.last(records) || default_val).timestamp;

    if (first > end || last < start) {
        return res.send({
            rtn: 0,
            data
        });
    }

    const pair = [Math.max(first, start), Math.min(last, end)];

    return res.send({
        rtn: 0,
        data: records.slice(
            Math.floor((pair[0] - first) / QUERY_INTERVAL),
            Math.ceil((pair[1] - first) / QUERY_INTERVAL)
        )
    });
});

app.listen(3000, () => console.log("wxy app start!"));
