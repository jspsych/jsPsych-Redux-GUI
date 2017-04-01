const pastStates = (state = [], action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        newState = [];
        return newState;
    case 'ARCHIVE_STATE_REMOVE':
        var oldState = Object.assign({}, action.state);

        var newState = [
            oldState,
            ...state.slice(0,50)
        ];

        action.store.dispatch({
            type: 'REMOVE_FUTURE_STATES'
        });

        return newState;
    case 'ARCHIVE_STATE':
        // Create a deep copy of the state object
        // NOTE: This will not deep copy sub-objects that must be done explicitly
        var oldState = Object.assign({}, action.state);

        var newState = [
            oldState,
            ...state
        ];

        action.store.dispatch({
            type: 'REMOVE_FUTURE_STATES'
        });

        return newState;
    case 'RESTORE_STATE':
        // Archive the current state of the store in futureStates
        action.store.dispatch({
            type: 'ARCHIVE_FUTURE_STATE',
            state: action.state
        });
        // Set the current state to be the most recently archived state
        action.store.dispatch({
            type: 'SET_STATE',
            state: state[0]
        });
        // Update pastStates
        var newState = [
            ...state.slice(1, 51)
        ];
        return newState;
    default:
        return state;
    }
};

export default pastStates;
