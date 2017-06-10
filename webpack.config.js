module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "public/bundle.js"
    },
    resolve: {
        root: __dirname,
        alias: {
            entry_index: 'src/index.js',
            component_app: 'src/common/components/App.js',
            component_app_bar: 'src/common/components/AppBar.js',
            component_preview: 'src/common/components/Preview.js',
            component_trial_form: 'src/common/components/TimelineNode/TrialForm.js',
            component_editor_drawer: 'src/common/components/TimelineNode/TimelineNodeEditorDrawer.js',
            component_organizer_drawer: 'src/common/components/TimelineNode/TimelineNodeOrganizerDrawer',
            component_organizer_item: 'src/common/components/TimelineNode/TimelineNodeOrganizerItem.js',
            constants_action: 'src/common/constants/ActionTypes.js',
            constants_utils: 'src/common/constants/utils.js',
            container_app: 'src/common/containers/App.js',
            container_app_bar:'src/common/containers/AppBar.js',
            container_preview:'src/common/containers/Preview.js',
            container_editor_drawer:'src/common/containers/TimelineNode/TimelineNodeEditorDrawer.js',
            container_organizer_drawer:'src/common/containers/TimelineNode/TimelineNodeOrganizerDrawer.js',
            container_organizer_item:'src/common/containers/TimelineNode/TimelineNodeOrganizerItem.js',
            container_trial_form: 'src/common/containers/TimelineNode/TrialForm/js',
            actions: 'src/common/actions/timelineNodeActions.js',
            actions_trial_form: 'src/common/actions/trialFormActions.js',
            reducer_index: 'src/common/reducers/index.js',
            reducer_timeline_node: 'src/common/reducers/timelineNode.js'
        }
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel',
            query: { presets: ['es2015', 'react', 'stage-0'] }
        }]
    }
};
