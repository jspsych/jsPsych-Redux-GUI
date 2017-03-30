const openTrial = (state = -1, action) => {
    switch (action.type) {
    case 'SET_OPEN_TRIAL':
        var newState = action.id;
        return newState;
    default:
        return state;
    }
};

export default openTrial;
