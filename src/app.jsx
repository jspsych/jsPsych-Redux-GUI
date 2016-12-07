// src/app.js

import React from 'react';
import { render } from 'react-dom';
import Timeline from 'Timeline';
import { deepFreeze } from 'deep-freeze';
import { Provider } from 'react-redux';
import { createStore,  combineReducers} from 'redux';
import { timeline } from 'reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const addTrial = (list) => {
    // ES6 notation for "list.concat(0)"
    return [...list, 0];
}

const removeTrial = (list, index) => {
    // ES6 notation for "list.slice(0, index).concat(list.slice(index + 1 ))"
    // i.e. Slice the section of the list from before index and concat it 
    // to the section after index
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ];
};

const setMuiTheme = getMuiTheme(darkBaseTheme);

// A "dump" component. It contains no logic
// It defines how the current state of the application is to be rendered
const App = ({
    trialList,
    addTrial,
    removeTrial
}) => (
        <Timeline
            value={trialList}
            onAdd={addTrial}
            onRemove={removeTrial}
            />
    );

// Create the Redux store with timeline as the reducer that
// manages the state updates
const store = createStore(timeline);

// Print the current state of the store to the console
console.log(store.getState());

// The application to be rendered
// A Timeline object, the state of which is determined by the state of the store
const renderApp = () => {
    render(
        <div>
            <MuiThemeProvider muiTheme={setMuiTheme}>
                <Provider store={store}>
                    <App
                        trialList={store.getState()}
                        addTrial={() => // Dispatch the action calling for a new trial to be added
                            store.dispatch({
                                type: 'ADD_TRIAL'
                            })
                        }
                        removeTrial={() =>
                            store.dispatch({
                                type: 'REMOVE_TRIAL'
                            })
                        }
                        />
                </Provider>
            </MuiThemeProvider>
        </div>,
        document.getElementById('app')
    );
};

// Callback that Redux store will call every time an action is dispatched
// i.e. Every time the state is changed
store.subscribe(renderApp)

// Render the application
renderApp();