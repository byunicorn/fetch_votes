const BaseWebpackConfig = require("./base");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

class ProdWebpackConfig extends BaseWebpackConfig {
    constructor() {
        super();

        this.extractTextPlugin = new ExtractTextWebpackPlugin("style.css");
        this.styleLoader = ExtractTextWebpackPlugin.extract([
            {
                loader: "css-loader",
                options: {
                    sourceMap: true
                }
            },
            {
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            }
        ]);
    }

    get config() {
        let base = this.defaultConfig;

        base.plugins.push(this.extractTextPlugin);
        return base;
    }
}

module.exports = ProdWebpackConfig;
