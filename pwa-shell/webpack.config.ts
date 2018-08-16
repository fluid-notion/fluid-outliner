import path from "path"
import webpack from "webpack"
import merge from "webpack-merge"

// @ts-ignore
// import FaviconsWebpackPlugin from "favicons-webpack-plugin"
// @ts-ignore
import WebpackPwaManifest from "webpack-pwa-manifest"

import pwaBaseConfig from "./webpack.config.base"

export default merge(pwaBaseConfig, {
    entry: {
        main: "./src/index.tsx",
        "outdated-browser-check": "./src/outdated-browser-check.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[hash].js",
        publicPath: pwaBaseConfig.mode === "production" ? "/fluid-outliner" : "/",
    },
    plugins: [
        new webpack.DefinePlugin({
            SHELL_ID: JSON.stringify("PWA"),
        }),
        // new FaviconsWebpackPlugin({
        //     logo: path.join(__dirname, "../assets/logo-text.png"),
        // }),
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
})
