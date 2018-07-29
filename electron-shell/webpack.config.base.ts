import webpack from "webpack"
import path from "path"
import merge from "webpack-merge"

import commonConfig from "../webpack.config.common"

const plugins = []

if (commonConfig.mode === "development") {
    plugins.push(
        new webpack.DefinePlugin({
            "process.env.DEV_SERVER_PORT": process.env.DEV_SERVER_PORT || 9666,
        })
    )
}

export default merge(commonConfig, {
    plugins,
    output: {
        path: path.join(__dirname, "app/dist"),
        filename: "bundle.js",
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: "commonjs2",
    },
    resolve: {
        modules: [path.join(__dirname, "app"), "node_modules"],
    },
})
