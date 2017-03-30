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

            // Reducer Files
            reducers: 'src/reducers/index.jsx',
            overReducers: 'src/reducers/overReducers.jsx',
            draggedReducers: 'src/reducers/draggedReducers.jsx',
            trialTableReducers: 'src/reducers/trialTableReducers.jsx',
            trialOrderReducers: 'src/reducers/trialOrderReducers.jsx',
            openTrialReducers: 'src/reducers/openTrialReducers.jsx',
            timelineOpenReducers: 'src/reducers/timelineOpenReducers.jsx',
            pastStatesreducers: 'src/reducers/pastStatesReducers.jsx',
            futureStatesReducers: 'src/reducers/futureStatesReducers.jsx',

            // Action Files
            actions: 'src/actions.jsx',
            // Component Files
            Timeline: 'src/Timeline.jsx',
            ButtonMenu: 'src/ButtonMenu.jsx',
            SelectableList: 'src/SelectableList.jsx',
            PluginDrawer: 'src/PluginDrawer.jsx',
            HotKeys: 'src/HotKeys.jsx',
            TrialItem: 'src/TrialItem.jsx',
            PluginForm: 'src/PluginForm.jsx',
            TitleBar: 'src/TitleBar.jsx'
        },
        extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: 'babel',
            presets: ['react', 'es2015', 'stage-0'],
            query: { presets: ['react', 'es2015', 'stage-0'] }
        }]
    }
};
