/**
 * Build config for electron 'Main Process' file
 */

import merge from "webpack-merge"
import baseConfig from "./webpack.config.base"

export default merge(baseConfig, {
    entry: ["./app/src/main.ts"],

    // 'main.js' in root
    output: {
        filename: "main.js",
    },

    /**
     * Set target to Electron specific node.js env.
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: "electron-main",

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false,
    },

    externals: {
        "electron-devtools-installer": "electron-devtools-installer",
        "electron-debug": "electron-debug",
    },
})
