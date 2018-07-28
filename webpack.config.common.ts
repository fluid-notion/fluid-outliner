import webpack from "webpack"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
// @ts-ignore
import DashboardPlugin from "webpack-dashboard/plugin" // tslint:disable-line

const mode: "production" | "development" =
    process.env.NODE_ENV === "production" ? "production" : "development"

const isProd = mode === "production"
// const isDev = mode === "development"

const plugins = [
    new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
    }),
    new DashboardPlugin(),
    new webpack.DefinePlugin({
        NODE_ENV: mode,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
        debug: true,
    }),
]

if (isProd) {
    plugins.unshift(new webpack.HotModuleReplacementPlugin())
}

const commonConfig: Partial<webpack.Configuration> = {
    mode,
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", ".json"],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: isProd ? "source-map" : "inline-source-map",
    plugins,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.client.json",
                        },
                    } /*,

                    TODO: Fix react-hot-loader support

                    {
                        loader: "babel-loader",
                        options: {
                            plugins: [
                                ["@babel/plugin-syntax-typescript", {
                                    isTSX: true,
                                }],
                                ["@babel/plugin-syntax-decorators", {
                                    legacy: true
                                }],
                                "@babel/plugin-syntax-jsx",
                                "@babel/plugin-syntax-dynamic-import"
                            ].concat(isProd ? [] : [
                                "react-hot-loader/babel",
                            ]),
                        },
                    }, */,
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            // WOFF Font
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                    },
                },
            },
            // WOFF2 Font
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/font-woff",
                    },
                },
            },
            // TTF Font
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "application/octet-stream",
                    },
                },
            },
            // EOT Font
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: "file-loader",
            },
            // SVG Font
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: "image/svg+xml",
                    },
                },
            },
            // Common Image Formats
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: "url-loader",
            },
        ],
    },
}

export default commonConfig
