module.exports = {
    entry: './src/app.jsx',
    output: {
        path: __dirname,
        filename: 'public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            components: 'src/components.jsx',
            reducers: 'src/reducers.jsx',
            actions: 'src/actions.jsx',
            Timeline: 'src/Timeline.jsx',
            Trial: 'src/Trial.jsx',
            SelectableList: 'src/SelectableList.jsx'
        },
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: { presets: ['es2015', 'react', 'stage-0'] }
        }]
    }
};