module.exports = {
    entry: {
        main: "./todo_app/static/js/Home.jsx"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: "babel-loader"
            }
        ]
    },
    output: {
        path: __dirname + "/todo_app/static/dist",
        filename: "[name].bundle.js"
    }
};
