import path from "path"
import merge from "webpack-merge"

import commonConfig from "../webpack.config.common"

export default merge(commonConfig, {
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
