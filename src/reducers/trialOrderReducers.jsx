const trialOrder = (state = [], action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
        var newState = [ 0 ];
        return newState;
    case 'SET_STATE':
        var newState = [
            ...action.state.trialOrder
        ];
        return newState;

    case 'DUPLICATE_TRIAL':

        // Get the index of the trial being duplicated
        var insertIndex = state.indexOf(action.copyFrom);

        // Insert the copy after the original
        var newOrder = [
            ...state.slice(0, insertIndex+1),
            action.index,
            ...state.slice(insertIndex+1)
        ];

        // Return
        return newOrder;
    case 'ADD_TRIAL':
        var newState = [
            ...state,
            action.id
        ];
        return newState;
    case 'ADD_TRIAL_AT_INDEX':
        var newID = action.id;
        var newState = [
            ...state.slice(0, action.index),
            newID,
            ... state.slice(action.index)
        ];
        return newState;
    case ""
    case 'REMOVE_TRIAL':
        var newState = [ ...state];

        // Find and remove all the selected trials
        for(var i = 0; i < action.toRemove.length; i++){

            var trial = action.toRemove[i];
            var index = newState.indexOf(trial);

            // IF the trial is in the top level
            if (index > -1){
                newState = [
                    ...newState.slice(0, index),
                    ...newState.slice(index+1)
                ];
            }
        }

        // If all the trial are removed add the default trial
        if (newState.length == 0){
            newState = [ 0 ];
        }
        return newState;
    default:
        return state;
    }
};

export default trialOrder;
