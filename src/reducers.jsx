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
                ]
            };
        case 'SELECT_TRIAL':
            // If the provided index is greater than the number of trials
            // set selected to be the last trial in the list.
            if (action.index > state.trials.length) {
                return {
                    selected: [...state.selected, state.trials.length],
                    trials: state.trials
                }
            } else {
                return {
                    selected: [...state.selected, action.index],
                    trials: state.trials
                };
            }
        case 'ADD_TRIAL':
            var index = state.trials.length;
            var name = "Trial_" + index.toString()
            return {
                selected: index,
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
                ]
            };
        case 'REMOVE_TRIAL':

            var index;          /// Used to set the new state.selected value.
            var new_trials = [];/// Used to store the updated trial list 
            var i = 0;          /// Used to create the new trial indices
            /// Fancy syntax for removing a list item without mutation
            var old_trials = state.trials;

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

            return {
                selected: [index],
                trials: new_trials
            };

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
