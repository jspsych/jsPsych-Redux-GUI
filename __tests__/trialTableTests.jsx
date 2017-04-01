import { createStore } from 'redux';
import trialTable from '../src/reducers/trialTableReducers.jsx';
import { Timeline } from '../src/reducers/trialTableReducers.jsx';
import deepFreeze from 'deep-freeze';

// Get an initial state
const store = createStore(trialTable);
const state = store.getState();

// Freeze it to ensure there is no mutation
deepFreeze(store);
deepFreeze(state);

//  TESTING INITIAL_STATE
// -------------------------
const test_INITIAL_STATE = () => {
    const test_INITIAL_STATE = trialTable(state, { type: 'INITIAL_STATE' });
    const soln_INITIAL_STATE = {
        '0': Timeline
    };
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('INITIAL_STATE', () => {
        expect(test_INITIAL_STATE).toEqual(soln_INITIAL_STATE);
    });
    /* eslint-enable */
};
// eslint-disable-next-line no-undef
describe('Testing trialTableReducers', () => {
    test_INITIAL_STATE();
});
