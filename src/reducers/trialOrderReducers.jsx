const trialOrder = (state = [], action) => {
    switch (action.type) {
    case 'INITIAL_STATE':
        var newState = [ "0" ];
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
            String(action.index),
            ...state.slice(insertIndex+1)
        ];

        // Return
        return newOrder;
    case 'ADD_TRIAL':
        var newState = [
            ...state,
            String(action.id)
        ];
        return newState;

    case 'INSERT_TRIAL_INTO_TRIALORDER':
        var newState = [
            ...state.slice(0, action.index),
            String(action.id),
            ...state.slice(action.index)
        ];
        console.log("NEW_STATE", newState)
        return newState;

    // These reducers do the same thing to trialOrder, the reason
        // there are two different names is because trialTable also
        // has a 'REMOVE_TRIAL' reducer so calling that would remove
        // the trial from trialOrder and trialTable. Calling 
        // REMOVE_TRIAL_FROM_TRIALORDER will only remove the trial 
        // from trialOrder which is what you want when moving the 
        // position of a trial
    case 'REMOVE_TRIAL':
    case 'REMOVE_TRIAL_FROM_TRIALORDER':
        var newState = [ ...state];

        // Find and remove all the selected trials
        for(var i = 0; i < action.toRemove.length; i++){

            var trial = action.toRemove[i];
            var index = newState.indexOf(String(trial));

            // IF the trial is in the top level
                newState = [
                    ...newState.slice(0, index),
                    ...newState.slice(index+1)
                ];
        }

        // If all the trial are removed add the default trial
        if (newState.length == 0){
            newState = [ "0" ];
        }
        console.log("Remove trila", newState)
        return newState;
    default:
        return state;
    }
};

export default trialOrder;
