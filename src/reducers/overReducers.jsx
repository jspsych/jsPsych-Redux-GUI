const over = (state = -1, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
    case 'SET_STATE':   // When a previous/future state is restored
    case 'RESET_OVER':  // The over prop is reset
        newState = null;
        return newState;
    case 'SET_OVER':
        var newState = action.over;
        return newState;
    default:
        return state;
    }
};
export default over;
