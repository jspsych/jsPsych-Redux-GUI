const dragged = (state = -1, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
    case 'SET_STATE':
        newState = null;
        return newState;
    case 'SET_DRAGGED':
        var newState = Object.assign({}, state);
        delete newState['dragged'];
        newState['dragged'] = action.dragged;
        return newState;
    case 'RESET_DRAGGED':
        var newState = null;
        return newState;
    default:
        return state;
    }
};
export default dragged;
