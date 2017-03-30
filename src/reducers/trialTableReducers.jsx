export const trialTable = (state = {}, action) => {
    switch(action.type) {
    case 'PLUGIN_CHANGE':
        var newState = Object.assign({}, state);
        newState[action.openTrial].pluginVal = action.pluginVal;
        return newState;
    default:
        return state;
    }
};
