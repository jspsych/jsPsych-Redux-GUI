const name = (state = 'default', action) =>
{
    switch(action.type) {
    case 'INITIAL_STATE':
        return 'default';
    default:
        return state;

    }
};

export default name;
