import InitialState from 'State'; // Any new features of the state should be added here

export const guiState = (state = {}, action) => {

    // If the state is undefined return the initial state
    if (typeof state === null) {
        return { Trial };
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
                return{
                    trials: {
                        ...state.trialList.slice(0, action.name),
                        new_trial,
                        ...state.trialList.slice(action.name)
                    },
                    ...state
                };
         case 'ADD_TRIAL':
            var index = state.trialList.length;
            var name = "Trial_" + index.toString()
            return {
                trials: {               /// Return a new list of trials made from appending...
                    ...state.trialList,    /// The old list of trials
                    name: {                   /// The new trial to be added 
                        ...Trial,
                        name: name
                    }
            },
		    ...state
            };
        case 'REMOVE_TRIAL':
            return {...state};
/*
		    var index;          /// Used to set the new state.selected value.
		    var new_trials = [];/// Used to store the updated trial list 
		    var i = 0;          /// Used to create the new trial indices
		    /// Fancy syntax for removing a list item without mutation
		    var old_trials = state.trialList;
            let { [action.]}
            return {
            ...state,
                state.trialList: {
                ...state.trialList.slice()
                }
            }


		    /*var new_openDrawers = [];
		    /// Rebuild the trial list to ensure that every trial has the correct key
		    for (var t = 0; t < old_trials.length; t++) {
			    if (!state.selected.includes(t)) {
				    new_trials = [
					    ...new_trials,
					    {
						    id: i,
						    name: old_trials[t].name,
						    children: old_trials[t].children,
						    type: old_trials[t].type,
						    pluginType: old_trials[t].pluginType,
						    pluginData: old_trials[t].pluginData,
						    errors: old_trials[t].errors
					    }
				    ]
				    i++;
			    }
		    }

		    /// Set the value of index to be one less than the 
		    /// trial removed unless that trial had index 0
		    if (action.index === 0) {
			    index = 0;
		    } else {
			    index = action.index - 1;
		    }
		    if (new_trials.length > 0){
			    new_openDrawers = state.openDrawers;
		    }
		    return {
			    ...state,
			    selected: [index],
			    trials: new_trials,
			    openDrawers: new_openDrawers
            }; */
        case 'OPEN_DRAWER':
            // If the provided drawer is already open do nothing
            if (state.openDrawer.equals(action.name)) {
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
            // If the provided drawer is open, close it by removing it from the list
            if (state.openDrawer.equals(action.name)) {
                // Get the index of the drawer to be closed
                var index = state.openDrawers.indexOf(action.name);
                return {
                    ...state,
                    openDrawer: action.name
                }
            }
            // Otherwise do nothing
            else {
                return { ...state }
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
