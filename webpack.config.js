module.exports = {
    entry: './src/app.jsx',
    output: {
        path: __dirname,
        filename: 'public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            app: 'src/app.jsx',
            components: 'src/components.jsx',
            reducers: 'src/reducers.jsx',
            actions: 'src/actions.jsx',
            Timeline: 'src/Timeline.jsx',
            ButtonMenu: 'src/ButtonMenu.jsx',
            SelectableList: 'src/SelectableList.jsx',
            PluginDrawer: 'src/PluginDrawer.jsx',
            HotKeys: 'src/HotKeys.jsx',
            TrialItem: 'src/TrialItem.jsx',
            TitleBar: 'src/TitleBar.jsx'
        },
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: { presets: ['react', 'es2015', 'stage-0', 'latest'] }
        }]
    }
};
