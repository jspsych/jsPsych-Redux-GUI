const timelineOpen = (state = false, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        newState = true;
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
