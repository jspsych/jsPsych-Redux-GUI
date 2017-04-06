const trialType = (state = 'trialType', action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
        return 'trialType';
    default:
        return state;
    }
};

export default trialType;
