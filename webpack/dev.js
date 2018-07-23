const webpack = require("webpack");
const BaseWebpackConfig = require("./base");

class DevWebpackConfig extends BaseWebpackConfig {
    constructor() {
        super();
        this.mode = "development";
    }

    get config() {
        let base = this.defaultConfig;
        base.mode = this.mode;
        base.devtool = "cheap-module-source-map";
        base.devServer = {
            historyApiFallback: true,
            hot: true,
            inline: true,
            host: "0.0.0.0",
            proxy: {
                '/votes': 'http://localhost:3000'
            }
        };

        base.plugins.push(new webpack.HotModuleReplacementPlugin());
        return base;
    }
}

module.exports = DevWebpackConfig;
