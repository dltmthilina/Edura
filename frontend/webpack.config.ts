import path from "path"; // A built-in Node.js module to handle file paths.
import HtmlWebpackPlugin from "html-webpack-plugin"; //Generates an index.html file automatically with the bundled JavaScript.
import webpack, {Configuration} from "webpack"; // A Webpack type definition for TypeScript.
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

const config = (env): Configuration & {devServer?: any} => ({
    entry: "./src/index.tsx", //The starting file of your application. Webpack starts bundling from this file.
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),

    output: {
        path: path.resolve(__dirname, "dist"), //Where to store the bundled files
        filename: "bundle.js", //Name of the output JavaScript file
        clean: true //Deletes old files in dist before bundling
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"], //Tells Webpack to resolve imports of .tsx, .ts, and .js files without specifying extensions.
        plugins: [new TsconfigPathsPlugin()] // to resolve custom paths from tsconfig.json.
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader", //Uses ts-loader to compile TypeScript files (.ts & .tsx).
                //options: { transpileOnly: true },
                exclude: /node_modules/ //Excludes node_modules for faster builds.
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"] //Uses style-loader and css-loader to load CSS into JavaScript.
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html" //Generates an index.html file in the dist/ folder and injects the bundled script.
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version)
        }),
        new ForkTsCheckerWebpackPlugin({}),
        new ESLintPlugin({
            // Use eslint-webpack-plugin instead
            extensions: ["ts", "tsx", "js", "jsx"]
        })
    ],
    devServer: {
        static: "./dist",
        hot: true,
        port: 3000
    }
});

module.exports = config;
