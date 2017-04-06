const timeline = (state = [], action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        return [];
    default:
        return state;
    }
};

export default timeline;
