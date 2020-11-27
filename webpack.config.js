const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    plugins: [new CompressionPlugin()],
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
