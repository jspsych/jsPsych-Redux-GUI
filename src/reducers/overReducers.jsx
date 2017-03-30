const over = (state = -1, action) => {
    switch(action.type) {
    case 'SET_OVER':
        var newState = action.over;
        return newState;
    default:
        return state;
    }
};
export default over;
