const dragged = (state = -1, action) => {
    switch(action.type) {
    case 'SET_DRAGGED':
        var newState = Object.assign({}, state);
        delete newState['dragged'];
        newState['dragged'] = action.dragged;
        return newState;
    default:
        return state;
    }
};
export default dragged;
