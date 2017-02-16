export const timeline = (state = {}, action) => {

    // If the state is undefined return the initial state
    if (typeof state === null) {
        return {};
    }

    // Perform an operation on the state specified by the action type
    switch (action.type) {

        // Reducer for the initial state
        case 'INITIAL_STATE':
            return {
                selected: [0],
                trials: [
                    {
                        id: 0,
                        name: "Trial_0",
                        children: [],
                        type: "type",
                        pluginType: "pluginType",
                        pluginData: [],
                        errors: null
                    }
                ],
                openDrawers: ['pluginDrawer']
            };
        case 'SELECT_TRIAL':
            // If the provided index is greater than the number of trials
            // set selected to be the last trial in the list.
            if (action.index > state.trials.length) {
                return {
                    selected: [state.trials.length],
			...state,
                }
            } else {
                return {
                    selected: [action.index],
			...state
                };
            }
        case 'SELECT_ADDITIONAL_TRIAL':
            // If the provided index is greater than the number of trials
            // set selected to be the last trial in the list.
            if (action.index > state.trials.length) {
                return {
                    selected: [...state.selected, state.trials.length],
                    trials: state.trials,
                    openDrawers: state.openDrawers
                }
            } else {
                // If the trial is already in the list of selected trials,
                // remove the trial from the list
                if (state.selected.includes(action.index)) {
                    var slicePoint = state.selected.indexOf(action.index);
                    return {
                        selected: [
                            ...state.selected.slice(0, slicePoint),
                            ...state.selected.slice(slicePoint + 1)
                        ],
			    ...state
                    };
                    // Otherwise add the trial to the list of selected trials
                } else {
                    return {
                        selected: [...state.selected, action.index],
			    ...state
                    };
                }
            }
        case 'ADD_TRIAL':
            var index = state.trials.length;
            var name = "Trial_" + index.toString()
            return {
                selected: [index],
                trials: [               /// Return a new list of trials made from appending...
                    ...state.trials,    /// The old list of trials
                    {                   /// The new trial to be added 
                        id: index,
                        name: name,
                        children: [],
                        type: "type",
                        pluginType: "pluginType",
                        pluginData: [],
                        errors: null
                    }
                ],
		    ...state
            };
        case 'REMOVE_TRIAL':

		    var index;          /// Used to set the new state.selected value.
		    var new_trials = [];/// Used to store the updated trial list 
		    var i = 0;          /// Used to create the new trial indices
		    /// Fancy syntax for removing a list item without mutation
		    var old_trials = state.trials;
		    var new_openDrawers = [];
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
            };
        case 'OPEN_DRAWER':
            // If the provided drawer is already open do nothing
            if (state.openDrawers.includes(action.name)) {
                return {
			...state
                }
            }
            // Otherwise add the drawer to the list of drawers that are open
            else {
                return {
		...state,
                    openDrawers: [
                        ...state.openDrawers,
                        action.name // The newly opened drawer
                    ]
                }
            }
        case 'CLOSE_DRAWER':
            // If the provided drawer is open, close it by removing it from the list
            if (state.openDrawers.includes(action.name)) {
                // Get the index of the drawer to be closed
                var index = state.openDrawers.indexOf(action.name);
                return {
			...state,
                    openDrawers: [ // Remove it from the list
                        ...state.openDrawers.slice(0, index),
                        ...state.openDrawers.slice(index + 1)
                    ]
                }
            }
            // Otherwise do nothing
            else {
                return {
			...state
                }
		    
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
