const pluginVal = (state = 'text', action) => {
    switch(action.type){
    case 'INITIAL_STATE':
        return 'text';
    default:
        return state;
    }
};

export default pluginVal;
