import path from "path"
import merge from "webpack-merge"

import HtmlWebpackPlugin from "html-webpack-plugin" // tslint:disable-line
// @ts-ignore
import OfflinePlugin from "offline-plugin"
// @ts-ignore
import FaviconsWebpackPlugin from "favicons-webpack-plugin"

import commonConfig from "../webpack.config.common"

export default merge(commonConfig, {
    entry: {
        main: "./src/index.tsx",
        "outdated-browser-check": "./src/outdated-browser-check.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[hash].js",
        publicPath:
            commonConfig.mode === "production" ? "/fluid-outliner" : "/",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Fluid Outliner",
            template: "src/index.html",
            inject: "head",
        }),
        new OfflinePlugin({
            responseStrategy: "network-first",
            appShell: "/",
        }),
        new FaviconsWebpackPlugin({
            logo: path.join(__dirname, "../assets/logo-text.png"),
        }),
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
})
