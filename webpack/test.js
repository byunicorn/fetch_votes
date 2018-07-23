const BaseWebpackConfig = require("./base");

class TestWebpackConfig extends BaseWebpackConfig {
    constructor() {
        super();
    }

    get config() {
        let base = this.defaultConfig;
        return base;
    }
}

module.exports = TestWebpackConfig;