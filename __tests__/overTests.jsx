import over from '../src/reducers/overReducers.jsx';
import deepFreeze from 'deep-freeze';


//  TESTING INITIAL_STATE
// -------------------------
const test_INITIAL_STATE = () => {
    const state = '0';
    deepFreeze(state);
    const test_INITIAL_STATE = over( 
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
    const test_SET_STATE = over( 
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

//  TESTING RESET_OVER
// -------------------------
const test_RESET_OVER = () => {
    const state = '0';
    deepFreeze(state);
    const test_RESET_OVER = over( 
        // The state when the action is dispatched
        state,
        {
            type: 'RESET_OVER'
        }
    );
    // What the state should be after dispatching the action
    const soln_RESET_OVER = null;
    /* eslint-disable */
    it('RESET_OVER', () => {
        expect(test_RESET_OVER).toEqual(soln_RESET_OVER);
    });
    /* eslint-enable */
};

//  TESTING SET_OVER
// -------------------------
const test_SET_OVER = () => {
    const state = null;
    const test_SET_OVER = over( 
        // The state when the action is dispatched
        state,
        {
            type: 'SET_OVER',
            over: 1
        }
    );
    // What the state should be after dispatching the action
    const soln_SET_OVER = 1;
    /* eslint-disable */
    it('SET_OVER', () => {
        expect(test_SET_OVER).toEqual(soln_SET_OVER);
    });
    /* eslint-enable */
};

// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
// eslint-disable-next-line no-undef
describe('Testing trialOrderReducers', () => {
    test_INITIAL_STATE();
    test_SET_STATE();
    test_RESET_OVER();
    test_SET_OVER();
});
