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
    case 'ADD_TRIAL':
        var newState = [
            ...state,
            action.id
        ];
        return newState;
    case 'REMOVE_TRIAL':
        var newState = [ ...state];

        // Get the list of trials to remove
        var removeList = action.toRemove;

        // Find and remove all the selected trials
        for(var i = 0; i < removeList.length; i++){

            var trial = removeList[i];

            if (action.state[trial].selected) {

                // IF the trial is in the top level
                if (action.state[trial].parentTrial == -1){
                    var index = newState.indexOf(trial);
                    newState = [
                        ...newState.slice(0, index),
                        ...newState.slice(index+1)
                    ];
                }
            }
        }

        // If all the trial are removed add the default trial
        if (Object.keys(newState.trialTable).length == 0){
            newState = [
                0
            ];
        }

        return newState;
    case 'REMOVE_TRIAL_FROM_TRIALORDER':
        var newState = [ ...state];

        var index = newState.indexOf(action.id);
        newState = [
            ...newState.slice(0, index),
            ...newState.slice(index+1)
        ];

        // If all the trial are removed add the default trial
        if (newState.length == 0){
            newState = [
                0
            ];
        }

        return newState;
    case 'INSERT_INTO_TRIALORDER':
        var newState = [
            ...state.slice(0, action.insertIndex),
            action.id,
            ... state.slice(action.insertIndex)
        ];
        return newState;
    default:
        return state;
    }
};

export default trialOrder;
