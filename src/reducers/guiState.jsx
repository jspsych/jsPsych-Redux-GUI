export const Timeline = {
    id: 0,
    name: 'default',
    pluginVal: 'text',
    isTimeline: true,
    timeline: [],
    trialType: 'trialType',
    parentTrial: -1,
    ancestry: [],
    selected: false
};
export const InitialState = {
    trialTable: {
        [Timeline.id]: Timeline,
    },
    trialOrder: [ '0' ],
    openTrial: -1,
    timelineOpen: true,
    pastStates: [],
    dragged: null,
    over: null,
    futureStates: []
};

// Main Store
export const guiState = (state = {}, action) => {
    // If the state is undefined return the initial state
    if (state === null) {
        return { InitialState };
    }
    // Perform an operation on the state specified by the action type
    switch (action.type) {
    // Reducer for the initial state
    case 'INITIAL_STATE':
        return InitialState;
    case 'RESTORE_FUTURE_STATE':
        var restoredState = Object.assign({}, state.futureStates[0]);

        var newPast = [
            state,
            ...state.pastStates
        ];
        var newFuture = [
            ...state.futureStates.slice(1,51)
        ];

        delete restoredState['futureStates'];
        delete restoredState['pastStates'];

        restoredState['futureStates'] = newFuture;
        restoredState['pastStates'] = newPast;
        return restoredState;
    case 'OPEN_DRAWER':
        var newState = Object.assign({}, state);
        delete newState['openTrial'];
        newState['openTrial'] = action.id;
        return newState;
    case 'CLOSE_DRAWER':
        // Create the new state
        var newState = Object.assign({}, state);
        delete newState['openTrial'];
        newState['openTrial'] = -1;
        return newState;
    case 'CHANGE_NAME':
        var newState = Object.assign({}, state);

        // action.name is the new name of the trial.
        newState.trialTable[newState.openTrial] = Object.assign({}, newState.trialTable[newState.openTrial]);
        newState.trialTable[newState.openTrial].name = action.name;

        return newState;
    default:
        return state;
    }
};

// Reducer for handling changes of an individual trial
export const trial = (state, action) => {
    if (state === null) {
        return 0;
    }
    switch (action.type) {
    default:
        return state;
    }
};
