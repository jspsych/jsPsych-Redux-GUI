import dragged from '../src/reducers/draggedReducers.jsx';
import deepFreeze from 'deep-freeze';


//  TESTING INITIAL_STATE
// -------------------------
const test_INITIAL_STATE = () => {
    const state = '0';
    deepFreeze(state);
    const test_INITIAL_STATE = dragged( 
        // The state when the action is dispatched
        state,
        {
            type: 'INITIAL_STATE'
        }
    );
    // What the state should be after dispatching the action
    const soln_INITIAL_STATE = null;
    /* eslint-disable */
    it('INITIAL_STATE', () => {
        expect(test_INITIAL_STATE).toEqual(soln_INITIAL_STATE);
    });
    /* eslint-enable */
};

//  TESTING SET_STATE
// -------------------------
const test_SET_STATE = () => {
    const state = '0';
    deepFreeze(state);
    const test_SET_STATE = dragged( 
        // The state when the action is dispatched
        state,
        {
            type: 'SET_STATE'
        }
    );
    // What the state should be after dispatching the action
    const soln_SET_STATE = null;
    /* eslint-disable */
    it('SET_STATE', () => {
        expect(test_SET_STATE).toEqual(soln_SET_STATE);
    });
    /* eslint-enable */
};

//  TESTING RESET_DRAGGED
// -------------------------
const test_RESET_DRAGGED = () => {
    const state = '0';
    deepFreeze(state);
    const test_RESET_DRAGGED = dragged( 
        // The state when the action is dispatched
        state,
        {
            type: 'RESET_DRAGGED'
        }
    );
    // What the state should be after dispatching the action
    const soln_RESET_DRAGGED = null;
    /* eslint-disable */
    it('RESET_DRAGGED', () => {
        expect(test_RESET_DRAGGED).toEqual(soln_RESET_DRAGGED);
    });
    /* eslint-enable */
};

//  TESTING SET_DRAGGED
// -------------------------
const test_SET_DRAGGED = () => {
    const state = null;
    const test_SET_DRAGGED = dragged( 
        // The state when the action is dispatched
        state,
        {
            type: 'SET_DRAGGED',
            dragged: 1
        }
    );
    // What the state should be after dispatching the action
    const soln_SET_DRAGGED = 1;
    /* eslint-disable */
    it('SET_DRAGGED', () => {
        expect(test_SET_DRAGGED).toEqual(soln_SET_DRAGGED);
    });
    /* eslint-enable */
};

// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
// eslint-disable-next-line no-undef
describe('Testing trialOrderReducers', () => {
    test_INITIAL_STATE();
    test_SET_STATE();
    test_RESET_DRAGGED();
    test_SET_DRAGGED();
});
