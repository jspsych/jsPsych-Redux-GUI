export const timeline = (state = [], action) => {

    // If the state is undefined return the initial state
    if (typeof state === 'undefined') {
        return {};
    }
    // Perform an operation on the state specified by the action type
    switch (action.type) {
        case 'INITIAL_STATE':
            return {
                selected: 0,
                trials: [
                    ...state.trials,
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
        case 'ADD_TRIAL':
            console.log("In reduce ", state);
            var index = state.length;
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
        case 'REMOVE_TRAIL':
            return [
                ...state.trials.slice(0, action.index),
                ...state.trials.slice(action.index + 1)
            ];
        default:
            return state;
    }
}

export const trial = (state = 0, action) => {
    if (typeof state === 'undefined') {
        return 0;
    }

    switch (action.type) {
        default:
            return state;
    }
}
