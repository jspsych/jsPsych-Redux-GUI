const openTrial = (state = -1, action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
    case 'CLOSE_DRAWER':
        newState = -1;
        return newState;
    case 'SET_STATE':
        var newState = action.state.openTrial;
        return newState;
    case 'OPEN_DRAWER':
    case 'SET_OPEN_TRIAL':
        var newState = action.id;
        return newState;
    default:
        return state;
    }
};

export default openTrial;
