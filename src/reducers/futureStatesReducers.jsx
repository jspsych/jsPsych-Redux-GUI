const futureStates = (state = [], action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        var newState = [];
        return newState;
    case 'SET_STATE':
        var newState = [
            ...action.state.futureStates
        ];
        return newState;
    case 'RESTORE_STATE':
        // Archive the current state of the store in futureStates
        var newState = [
            action.state,
            ...state
        ];
        return newState;
    // Both reducers are handled in the same manner
    case 'ARCHIVE_STATE_REMOVE':
    case 'ARCHIVE_STATE':
        var newState = [];
        return newState;
    case 'RESTORE_FUTURE_STATE':
        var newState = [
            ...state.slice(1,51)
        ];
        return newState;
    default:
        return state;
    }
};

export default futureStates;
