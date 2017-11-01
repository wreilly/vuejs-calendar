module.export = {
    output: {
        path: "/Users/william.reilly/dev/VueJS/Udemy-Ultimate-VueJS-AGore/03-Calendar-Project/vuejs-calendar/dist",
        publicPath: "/dist/",
        filename: "node.bundle.js",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: "/\.js$/",
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "es2015"
                                ]
                            ],
                            plugins: [
                                "transform-es2015-destructuring",
                                "transform-runtime"
                            ]
                        }
                    }
                ],
                exclude: "/node_modules/"
            },
            {
                test: "/\.scss$/",
                loader: [
                    {
                        loader: "/Users/william.reilly/dev/VueJS/Udemy-Ultimate-VueJS-AGore/03-Calendar-Project/vuejs-calendar/node_modules/extract-text-webpack-plugin/loader.js",
                        options: {
                            omit: 1,
                            remove: true
                        }
                    },
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: "/\.(png|jpg|gif|svg|ttf)$/",
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]",
                    publicPath: false
                }
            },
            {
                test: "/\.vue$/",
                loader: "vue-loader",
                options: {
                    loaders: {
                        scss: "vue-style-loader!css-loader!sass-loader"
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.common.js"
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    target: "node",
    entry: {
        app: [
            "./src/node.entry.js"
        ]
    },
    plugins: [

    ],
    devtool: false
}
;