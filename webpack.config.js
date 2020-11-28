const CompressionPlugin = require("compression-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    plugins: [
        new CompressionPlugin(),
        new CopyPlugin({
            patterns: [{from: "./todo_app/static/favicon", to: "../favicon"}]
        })
    ],
    entry: {
        home: "./todo_app/static/js/Home.jsx"
    },
    resolve: {extensions: ['.js','.jsx']},
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: "babel-loader"
            },
            {
                test: /\.sass$/,
                use:['style-loader','css-loader', 'sass-loader']
            }
        ]
    },
    output: {
        path: __dirname + "/todo_app/static/dist/js",
        filename: "[name].bundle.js"
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            name: "shared"
        }
    }
};
