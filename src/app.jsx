// src/app.js

import React from 'react';
import { render } from 'react-dom';
import { deepFreeze } from 'deepFreeze';
import { createStore } from 'Redux';
import { timeline } from 'reducers';

// A "dump" component. It contains no logic
// It defines how the current state of the application is to be rendered
const Timeline = ({
    value,
    addTrial,
    removeTrial
}) => (
        <div>
            <h1>{value}</h1>
            <button onClick={addTrial}>+</button>
            <button onClick={removeTrial}>-</button>
        </div>
    );

// Create the Redux store with timeline as the reducer that
// manages the state updates
const store = createStore(timeline);

// Print the current state of the store to the console
console.log(store.getState());

// The application to be rendered
// A Timeline object, the state of which is determined by the state of the store
const render = () => {
    render(
        < Timeline
            value={store.getState()}
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
            />,
        document.getElementById('app')
    );
};

// Callback that Redux store will call every time an action is dispatched
// i.e. Every time the state is changed
store.subscribe(render)