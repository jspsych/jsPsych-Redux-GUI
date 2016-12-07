export const timeline = (state = [], action) => {

    // If the state is undefined return the initial state
    if (typeof state === 'undefined') {
        return [];
    }
    // Perform an operation on the state specified by the action type
    switch (action.type) {
        case 'ADD_TRIAL':
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                }
            ];
        case 'REMOVE_TRAIL':
            return state;
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
