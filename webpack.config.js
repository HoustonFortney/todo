module.exports = {
    entry: {
        main: "./todo_app/static/js/Home.jsx"
    },
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
        path: __dirname + "/todo_app/static/dist",
        filename: "[name].bundle.js"
    }
};
