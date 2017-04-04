const dragged = (state = -1, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
    case 'SET_STATE':
    case 'RESET_DRAGGED':
        newState = null;
        return newState;
    case 'SET_DRAGGED':
        var newState = action.dragged;
        return newState;
    default:
        return state;
    }
};
export default dragged;
