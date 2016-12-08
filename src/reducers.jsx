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
                selected: 0,  
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
	if (action.index > state.trials.length) {
	    return {
		selected: state.trials.length,
		trials: state.trials
	    }
	} else {
            return {
                selected: action.index,
                trials: state.trials
            };
	}        
    case 'ADD_TRIAL':
            var index = state.trials.length;
            var name = "Trial_" + index.toString()
            return {
                selected: index,
                trials: [
                    ...state.trials,
                    {
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
            var index;
            if (action.index === 0) {
                index = 0;
            } else {
                index = action.index - 1;
            }
            return {
                selected: index,
                trials: [
                    ...state.trials.slice(0, action.index),
                    ...state.trials.slice(action.index + 1)
                ]
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
