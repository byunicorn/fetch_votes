module.exports = env => {
    let ConfigClz = null;

    if (env.prod) {
        ConfigClz = require("./webpack/prod");
    } else if (env.test) {
        ConfigClz = require("./webpack/test");
    } else {
        ConfigClz = require("./webpack/dev");
    }

    return new ConfigClz().config;
};
