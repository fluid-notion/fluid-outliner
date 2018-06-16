import HtmlWebpackPlugin from "html-webpack-plugin"; // tslint:disable-line
import * as path from "path";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
// @ts-ignore
import DashboardPlugin from "webpack-dashboard/plugin"; // tslint:disable-line

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const isDev = mode === "development";

export default {
  entry: "./app/index.tsx",
  mode,
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "[name].[chunkhash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Fluid Notion",
      template: "app/index.html"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: isDev ? "server" : "static",
      openAnalyzer: false
    }),
    new DashboardPlugin()
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.client.json"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif|ttf|woff2?|eot|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  }
};
