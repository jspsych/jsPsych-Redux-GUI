import React from 'react';
import createStore from 'redux';
// NOTE: the '../src' is necessary as this file is in the 'root/__tests__ 
// directory rather than the 'root/src' directory
import rootReducer from '../src/reducers';
import deepFreeze from 'deep-freeze';


console.log('Before InitialState');//, InitialState)
console.warn('Warning');
console.error('Error');
// Get an initial state
const store = createStore(rootReducer);
console.log('After');//, InitialState)
console.warn('Warning');
console.error('Error');
const InitialState = store.getState();
console.log('After');//, InitialState)
console.warn('Warning');
console.error('Error');

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
const trialOrderTest_ADD_TRIAL = () => {
    // New trial's unique id
    var index = Math.random();

    // Ensure there are no duplicate trial names 
    while(index === 0){
        index = Math.random();
    }

    // test_ADD_TRIAL_1 is defined as the result of dispatching the
    // 'ADD_TRIAL' reducer on trialOrder
    const test_ADD_TRIAL_1 = trialOrder(InitialState, 
        {
            type: 'ADD_TRIAL',
            id: index
        });


    // soln_ADD_TRIAL_1 is defined as the correct result of dispatching
    // 'ADD_TRIAL' on InitialState (i.e. it's the solution to test_ADD_TRIAL_1)
        // This is what the state of trialOrder should look like
        // after calling ADD_TRIAL
    const soln_ADD_TRIAL_1 = [ '0', String(index) ];
    // This is the test itself, it just checks the equally
    // of the test_* and the soln_*
    it('ADD_TRIAL', () => {
        expect(test_ADD_TRIAL_1).toEqual(soln_ADD_TRIAL_1);
    });
};
// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
describe('Testing trialOrderReducers', () => {
    trialOrderTest_ADD_TRIAL();
});
