import path from "path"

import pwaConfig from "../pwa-shell/webpack.config"

export default {
    ...pwaConfig,
    entry: {
        main: "./src/index.tsx",
    },
    output: {
        path: path.join(__dirname, "www"),
        filename: "[name].[hash].js",
    },
}
