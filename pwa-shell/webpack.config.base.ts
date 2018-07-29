import path from "path"
import merge from "webpack-merge"

import HtmlWebpackPlugin from "html-webpack-plugin" // tslint:disable-line
// @ts-ignore
import OfflinePlugin from "offline-plugin"

import commonConfig from "../webpack.config.common"

export default merge(commonConfig, {
    plugins: [
        new HtmlWebpackPlugin({
            title: "Fluid Outliner",
            template: "src/index.html",
        }),
        new OfflinePlugin({
            responseStrategy: "network-first",
            appShell: "/",
        }),
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
})
