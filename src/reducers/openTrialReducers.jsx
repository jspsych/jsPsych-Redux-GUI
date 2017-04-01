const openTrial = (state = -1, action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
        newState = -1;
        return newState;
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
    case 'SET_OPEN_TRIAL':
        var newState = action.id;
        return newState;
    default:
        return state;
    }
};

export default openTrial;
