import HtmlWebpackPlugin from "html-webpack-plugin"; // tslint:disable-line
import * as path from "path";

export default {
  entry: "./app/index.tsx",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "dist-webpack"),
    filename: "[name].[chunkhash].js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Fluid Notion"
    })
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
            configFile: "tsconfig.client.json"
        }
      }
    ]
  }
};
