module.exports = {
    entry: './src/app.jsx',
    output: {
        path: __dirname,
        filename: 'public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            // Main App
            app: 'src/app.jsx',

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
            Timeline: 'src/components/Timeline.jsx',
            ButtonMenu: 'src/components/ButtonMenu.jsx',
            SelectableList: 'src/components/SelectableList.jsx',
            PluginDrawer: 'src/components/PluginDrawer.jsx',
            HotKeys: 'src/components/HotKeys.jsx',
            TrialItem: 'src/components/TrialItem.jsx',
            PluginForm: 'src/components/PluginForm.jsx',
            TitleBar: 'src/components/TitleBar.jsx'
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
