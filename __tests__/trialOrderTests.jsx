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


//  TESTING INITIAL_STATE
// -------------------------
const test_INITIAL_STATE = () => {
    const test_INITIAL_STATE = trialOrder(state, { type: 'INITIAL_STATE' });
    deepFreeze(test_INITIAL_STATE);
    const soln_INITIAL_STATE = [ 0 ];
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('INITIAL_STATE', () => {
        expect(test_INITIAL_STATE).toEqual(soln_INITIAL_STATE);
    });
    /* eslint-enable */
};

//  TESTING SET_STATE
// -------------------------
const test_SET_STATE = () => {
    // NOTE: The test only needs to supply the parts of the
    //       action that are relevent to the store property 
    //       being tested. Even when the actual action supplies
    //       more information for used by other store properties
    const test_SET_STATE = trialOrder(state,
        {
            type: 'SET_STATE',
            state: {
                trialOrder: [1, 2, 3, 4]
            }
        }
    );
    deepFreeze(test_SET_STATE);

    const soln_SET_STATE = [ 1, 2, 3, 4];
    /* eslint-disable */
    it('SET_STATE', () => {
        expect(test_SET_STATE).toEqual(soln_SET_STATE);
    });
    /* eslint-enable */
};

//  TESTING ADD_TRIAL
// ------------------------------------
//  Test all the different situations where 
//  ADD_TRIAL can be called here
const test_ADD_TRIAL = () => {

    // ID of the trial to be added
    var id = 1;

    // test_ADD_TRIAL_1 is defined as the result of dispatching the
    // 'ADD_TRIAL' reducer on trialOrder
    const test_ADD_TRIAL_1 = trialOrder(state,
        {
            type: 'ADD_TRIAL',
            id: id
        });
    deepFreeze(test_ADD_TRIAL);


    // soln_ADD_TRIAL_1 is defined as the correct result of dispatching
    // 'ADD_TRIAL' on InitialState (i.e. it's the solution to test_ADD_TRIAL_1)
        // This is what the state of trialOrder should look like
        // after calling ADD_TRIAL
    const soln_ADD_TRIAL_1 = [ id ];
    // This is the test itself, it just checks the equally
    // of the test_* and the soln_*
    /* eslint-disable */
    it('ADD_TRIAL', () => {
        expect(test_ADD_TRIAL_1).toEqual(soln_ADD_TRIAL_1);
    });
    /* eslint-enable */
};

//  TESTING ADD_TRIAL_AT_INDEX
// ------------------------------------
//  Test all the different situations where 
//  ADD_TRIAL_AT_INDEX can be called here
const test_ADD_TRIAL_AT_INDEX = () => {
    // New trial's unique id
    var id = 2;

    const initialState = [0, 1, 3, 4];

    // test_ADD_TRIAL_AT_INDEX_1 is defined as the result of dispatching the
    // 'ADD_TRIAL_AT_INDEX' reducer on trialOrder
    const test_ADD_TRIAL_AT_INDEX_1 = trialOrder(
        initialState,
        {
            type: 'ADD_TRIAL_AT_INDEX',
            id: id,
            index: 2
        });
    deepFreeze(test_ADD_TRIAL);


    // soln_ADD_TRIAL_AT_INDEX_1 is defined as the correct result of dispatching
    // 'ADD_TRIAL_AT_INDEX' on InitialState (i.e. it's the solution to test_ADD_TRIAL_AT_INDEX_1)
        // This is what the state of trialOrder should look like
        // after calling ADD_TRIAL_AT_INDEX
    const soln_ADD_TRIAL_AT_INDEX_1 = [ 0, 1, 2, 3, 4 ];
    // This is the test itself, it just checks the equally
    // of the test_* and the soln_*
    /* eslint-disable */
    it('ADD_TRIAL_AT_INDEX', () => {
        expect(test_ADD_TRIAL_AT_INDEX_1).toEqual(soln_ADD_TRIAL_AT_INDEX_1);
    });
    /* eslint-enable */
};

//  TESTING REMOVE_TRIAL
// -------------------------
const test_REMOVE_TRIAL = () => {
    // Get the list of trials to remove
    const initialState = [ 1, 2, 3, 4];
    deepFreeze(initialState);
    // NOTE: The test only needs to supply the parts of the
    //       action that are relevent to the store property 
    //       being tested. Even when the actual action supplies
    //       more information for used by other store properties
    const test_REMOVE_TRIAL = trialOrder( 
        // The state when the action is dispatched
        initialState,
        // The action to dispatch
        {
            type: 'REMOVE_TRIAL',
            toRemove: [ 1, 3 ]
        }
    );
    deepFreeze(test_REMOVE_TRIAL);


    // What the state should be after dispatching the action
    const soln_REMOVE_TRIAL = [ 2, 4];
    /* eslint-disable */
    it('REMOVE_TRIAL', () => {
        expect(test_REMOVE_TRIAL).toEqual(soln_REMOVE_TRIAL);
    });
    /* eslint-enable */
};

//  TESTING DUPLICATE_TRIAL
// -------------------------
const test_DUPLICATE_TRIAL = () => {
    // Get the list of trials to remove
    const initialState = [ 1, 2, 3, 4];
    deepFreeze(initialState);

    const test_DUPLICATE_TRIAL = trialOrder( 
        // The state when the action is dispatched
        initialState,
        // The action to dispatch
        {
            type: 'DUPLICATE_TRIAL',
            index: 5,
            copyFrom: 3
        }
    );
    deepFreeze(test_DUPLICATE_TRIAL);

    // What the state should be after dispatching the action
    const soln_DUPLICATE_TRIAL = [ 1, 2, 3, 5, 4];

    /* eslint-disable */
    it('DUPLICATE_TRIAL', () => {
        expect(test_DUPLICATE_TRIAL).toEqual(soln_DUPLICATE_TRIAL);
    });
    /* eslint-enable */
};

// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
// eslint-disable-next-line no-undef
describe('Testing trialOrderReducers', () => {
    test_INITIAL_STATE();
    test_SET_STATE();
    test_ADD_TRIAL();
    test_ADD_TRIAL_AT_INDEX();
    test_REMOVE_TRIAL();
    test_DUPLICATE_TRIAL();
});
