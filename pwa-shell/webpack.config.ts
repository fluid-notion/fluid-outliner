import path from "path"
import merge from "webpack-merge"

// @ts-ignore
import WebpackPwaManifest from "webpack-pwa-manifest"
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
        }),
        new OfflinePlugin({
            responseStrategy: "network-first",
            appShell: "/",
        }),
        new FaviconsWebpackPlugin({
            logo: path.join(__dirname, "../assets/logo-text.png"),
        }),
        new WebpackPwaManifest({
            name: "Fluid Outliner",
            short_name: "Outliner",
            display: "standalone",
            theme_color: "#673ab7",
            background_color: "#673ab7",
            orientation: "portrait",
            inject: true,
            fingerprints: true,
            icons: [
                {
                    src: path.join(__dirname, "../assets/colored-logo.png"),
                    sizes: [96, 128, 192, 256, 384, 512],
                },
            ],
        }),
    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
})
