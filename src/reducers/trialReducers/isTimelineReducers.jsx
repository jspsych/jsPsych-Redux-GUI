const isTimeline = (state = false, action) => {
    switch(action.type){
    case 'INITIAL_STATE':
        return false;
    default:
        return state;
    }
};

export default isTimeline;
