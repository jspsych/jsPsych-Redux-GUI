import InitialState from 'State'; // Any new features of the state should be added here

export const guiState = (state = {}, action) => {

    // If the state is undefined return the initial state
    if (typeof state === null) {
        return { InitialState };
    }

    // Perform an operation on the state specified by the action type
    switch (action.type) {

        // Reducer for the initial state
        case 'INITIAL_STATE':
            console.log("InitialState", InitialState);
            return InitialState;
        case 'SELECT_TRIAL':

            var old_trial = state.trialList[action.name];

            // Make the updated the trial property by constructing a new hashtable
            var new_trial = {
                selected: true,
                ...old_trial
            }
            var newTrialList = state.trialList;
            delete newTrialList[action.name];
            return{
                trials: {
                    new_trial,
                    ...newTrialList
                },
                ...state
            };
        case 'ADD_TRIAL':
            var index = Object.keys(state.trialList).length;
            var name = "Trial_" + index.toString()
            return{
                trialList:{
                    [name]: {
                        name: name,
                        ...InitialState['default']
                    },
                    ...state.trialList
                },
                ...state
            };
        case 'REMOVE_TRIAL':
            // Remove the trial without mutation
            let {[action.name]: deletedItem, ...rest} = state.trialList;

            return { 
                trialList: rest,
                ...state
            }

        case 'OPEN_DRAWER':
            // If the provided drawer is already open do nothing
            if (state.openDrawer == action.name) {
                return {
			...state
                }
            }
            // Otherwise add the drawer to the list of drawers that are open
            else {
                return {
                    ...state,
                    openDrawer: action.name
                }
            }
        case 'CLOSE_DRAWER':
                return {
                    openDrawer: 'none',
                    ...state 
                }
        default:
            return state;
    }
       
}

// Reducer for handling changes of an individual trial
export const trial = (state, action) => {
    if (typeof state === null) {
        return 0;
    }

    switch (action.type) {
        default:
            return state;
    }
}
