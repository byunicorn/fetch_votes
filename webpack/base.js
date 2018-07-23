const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

class WebpackBaseConfig {
    constructor() {
        this.srcDir = path.resolve(__dirname, "../src");
        this.distDir = path.resolve(__dirname, "../dist");
        this.vendor = ["moment", "axios", "react", "react-dom"];
        this.htmlTemplate = path.resolve(this.srcDir, "index.html");

        this.styleLoader = [
            {
                loader: "style-loader"
            },
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
        ];
    }

    get defaultConfig() {
        return {
            entry: {
                vendor: this.vendor,
                app: this.srcDir
            },
            output: {
                path: this.distDir,
                filename: "[name].[hash].js"
            },
            resolve: {
                modules: ["node_modules"],
                extensions: [".jsx", ".js"]
            },
            module: {
                rules: [
                    {
                        test: /\.jsx?$/,
                        include: this.srcDir,
                        use: [{ loader: "babel-loader" }]
                    },
                    {
                        test: /\.(scss|css)$/,
                        use: this.styleLoader
                    },
                    {
                        test: /\.(png|jpg|gif|ttf|mp4|ogg|svg|woff|woff2|otf)$/,
                        use: [{ loader: "file-loader" }]
                    },
                    {
                        test: /\.json$/,
                        use: ["json-loader"]
                    }
                ]
            },
            plugins: [
                new CleanWebpackPlugin(this.distDir),
                new HtmlWebpackPlugin({
                    template: this.htmlTemplate
                })
            ]
        };
    }
}

module.exports = WebpackBaseConfig;
