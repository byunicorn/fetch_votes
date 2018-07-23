const request = require("request");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const { QUERY_URI, QUERY_INTERVAL, QUERY_LOG } = require("./const");

const log = path.resolve(__dirname, QUERY_LOG);

if (!fs.existsSync(log)) {
    fs.writeFileSync(log, { flag: "wx" });
}

const records = [];

const reg = new RegExp(",", "g");
const query = () => {
    request.get(QUERY_URI, function(err, res, body) {
        body = JSON.parse(body);
        if (res.statusCode === 200 && body.ok === 1) {
            let record = { timestamp: Math.floor(Date.now() / 1000) };
            let raw = _.get(body, "data.cards.1.card_group", []);
            let filtered = _.filter(raw, item => item.card_type === 52);
            _.map(filtered, row => {
                for (let item of row.items) {
                    record[item.title] = parseFloat(_.replace(item.price2, reg, ""));
                }
            });

            records.push(record);

            fs.appendFile(log, JSON.stringify(record) + ",\n", err => {
                if (err) {
                    console.error(err);
                }
            });
        }
    });
};

module.exports = () => {
    setInterval(query, QUERY_INTERVAL);
    return records;
};
