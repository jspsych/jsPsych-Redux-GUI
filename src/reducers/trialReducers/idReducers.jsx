
const id = (state = -1, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        var newState = -1;
        return newState;
    default:
        return state;
    }
};

export default id;
