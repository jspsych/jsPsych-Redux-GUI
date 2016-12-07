export const timeline = (state = 0, action) => { 
    
    // If the state is undefined return the initial state
    if (typeof state === 'undefined') {
        return 0;
    }
    // Perform an operation on the state specified by the action type
    switch (action.type) {
        case 'ADD_TRIAL':
            return state;
        case 'REMOVE_TRAIL':
            return state;
        default:
            return state;
    }
}
