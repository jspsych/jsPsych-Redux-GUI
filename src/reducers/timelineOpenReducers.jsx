const timelineOpen = (state = false, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        newState = true;
        return newState;
    case 'SET_STATE':
        var newState = [
            ...action.state.timelineOpen
        ];
        return newState;
    case 'OPEN_TIMELINE':
        var newState  = true;
        return newState;
    case 'CLOSE_TIMELINE':
        var newState = false;
        return newState;
    default:
        return state;
    }
};

export default timelineOpen;
