const parentTrial = (state = -1, action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
        return -1;
    default:
        return state;
    }
};

export default parentTrial;
