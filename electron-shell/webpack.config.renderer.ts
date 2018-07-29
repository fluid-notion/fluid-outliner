import webpack from "webpack"
import merge from "webpack-merge"
// tslint:disable-next-line:
import HtmlWebpackPlugin from "html-webpack-plugin"
import baseConfig from "./webpack.config.base"
// @ts-ignore
import HtmlWebpackHardiskPlugin from "html-webpack-harddisk-plugin"

let entry
let output

const port = process.env.DEV_SERVER_PORT || 9666

if (baseConfig.mode === "production") {
    entry = "./app/src/renderer.tsx"
    output = {
        publicPath: "",
    }
} else {
    entry = [
        "react-hot-loader/patch",
        `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr&reload=true`,
        "./app/src/renderer.tsx",
    ]
    output = {
        publicPath: `http://localhost:${port}/dist/`,
    }
}

export default merge(baseConfig, {
    devtool: "source-map",
    entry,
    output,
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "app/src/index.html",
            alwaysWriteToDisk: true,
        }),
        new HtmlWebpackHardiskPlugin(),
        new webpack.DefinePlugin({
            SHELL_ID: JSON.stringify("ELECTRON"),
        }),
    ],
    devServer: {
        port,
    },
    // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
    target: "electron-renderer",
})
