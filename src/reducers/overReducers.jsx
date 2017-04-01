const over = (state = -1, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        newState = null;
        return newState;
    case 'SET_OVER':
        var newState = action.over;
        return newState;
    case 'RESET_OVER':
        var newState = null;
        return newState;
    default:
        return state;
    }
};
export default over;
