const QUERY_URI = "https://m.weibo.cn/api/container/getIndex?containerid=1059030002_6800_42";
const QUERY_INTERVAL = 60 * 5 * 1000;
// const QUERY_INTERVAL = 10 * 1000;
const QUERY_LOG = "../records.log";
const TOP_COUNT = 4;

module.exports = {
    QUERY_URI,
    QUERY_INTERVAL,
    QUERY_LOG,
    TOP_COUNT
};
