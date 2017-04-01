import { createStore } from 'redux';
import trialOrder from '../src/reducers/trialOrderReducers.jsx';
import deepFreeze from 'deep-freeze';

// Get an initial state
const store = createStore(trialOrder);
const state = store.getState();

// Freeze it to ensure there is no mutation
deepFreeze(store);

////  Testing  ////

// NOTE: As this file (and those like it) are for 
// specificly testing individual reducers, we have
// to take care of the logic usually handled by the action.
// Tests for actions go in the actionsTesting.jsx file.

// The variables/states that are used in a test should be
// defined within the scope of the function representing that
// test. This will allow the variable names in the tests to 
// be standardized without have different test interfear with
// each other's results.
// TESTING INITIAL_STATE
const trialOrderTest_INITIAL_STATE = () => {
    const test_INITIAL_STATE = trialOrder(state, { type: 'INITIAL_STATE' });
    const soln_INITIAL_STATE = [ 0 ];
    /* eslint-disable */
    it('INITIAL_STATE', () => {
        expect(test_INITIAL_STATE).toEqual(soln_INITIAL_STATE);
    });
    /* eslint-enable */
};

//  TESTING ADD_TRIAL
// ------------------------------------
//  Test all the different situations where 
//  ADD_TRIAL can be called here
const trialOrderTest_ADD_TRIAL = () => {
    // New trial's unique id
    var index = Math.random();

    // Ensure there are no duplicate trial names 
    while(index === 0){
        index = Math.random();
    }

    // test_ADD_TRIAL_1 is defined as the result of dispatching the
    // 'ADD_TRIAL' reducer on trialOrder
    const test_ADD_TRIAL_1 = trialOrder(state,
        {
            type: 'ADD_TRIAL',
            id: index
        });


    // soln_ADD_TRIAL_1 is defined as the correct result of dispatching
    // 'ADD_TRIAL' on InitialState (i.e. it's the solution to test_ADD_TRIAL_1)
        // This is what the state of trialOrder should look like
        // after calling ADD_TRIAL
    const soln_ADD_TRIAL_1 = [ index ];
    // This is the test itself, it just checks the equally
    // of the test_* and the soln_*
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. (They are defined implicitly by jest)
    /* eslint-disable */
    it('ADD_TRIAL', () => {
        expect(test_ADD_TRIAL_1).toEqual(soln_ADD_TRIAL_1);
    });
    /* eslint-enable */
};

// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
// eslint-disable-next-line no-undef
describe('Testing trialOrderReducers', () => {
    trialOrderTest_INITIAL_STATE();
    trialOrderTest_ADD_TRIAL();
});
