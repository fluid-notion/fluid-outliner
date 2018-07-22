import path from "path"
import merge from "webpack-merge"

import HtmlWebpackPlugin from "html-webpack-plugin" // tslint:disable-line
// @ts-ignore
import OfflinePlugin from "offline-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

import commonConfig from "../webpack.config.common"

export default merge(commonConfig, {
    entry: {
        main: "./src/index.tsx",
        "outdated-browser-check": "./src/outdated-browser-check.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[hash].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Fluid Outliner",
            template: "src/index.html",
        }),
        new OfflinePlugin({
            responseStrategy: "network-first",
            appShell: "/",
            externals: [
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://fonts.googleapis.com/css?family=Roboto:300,400,500",
                "favicon.ico",
            ],
        }),
        new CopyWebpackPlugin([
            {
                from: "**/*",
                to: ".",
                context: "../public/",
            },
        ]),
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
})
