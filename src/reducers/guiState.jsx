
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
        var newState = {
        '0': 
        }
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
