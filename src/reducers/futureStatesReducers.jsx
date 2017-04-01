const futureStates = (state = [], action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        var newState = [];
        return newState;
    case 'ARCHIVE_FUTURE_STATE':
        var newState = [
            action.state,
            ...state
        ];
        return newState;
    case 'REMOVE_FUTURE_STATES':
        var newState = [];
        return newState;
    case 'RESTORE_FUTURE_STATE':
        action.store.dispatch({
            type: 'ARCHIVE_STATE',
            state: action.state
        });
        var newState = [
            ...state.slice(1,51)
        ];
        return newState;
    default:
        return state;
    }
};

export default futureStates;
