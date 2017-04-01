import { createStore } from 'redux';
import trialTable from '../src/reducers/trialTableReducers.jsx';
import { Trial, Timeline } from '../src/reducers/trialTableReducers.jsx';
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

//  TESTING SET_STATE
// -------------------------
const test_SET_STATE = () => {
    const emptyState = {};  // Make an empty state
    deepFreeze(emptyState); // Ensure no mutations

    const stateToSet = {
        '0': Timeline
    };
    deepFreeze(stateToSet);

    const test_SET_STATE = trialTable(
        emptyState,
        {
            type: 'SET_STATE',
            state: {
                trialTable: stateToSet
            }
        });
    const soln_SET_STATE = {
        '0': Timeline
    };
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('SET_STATE', () => {
        expect(test_SET_STATE).toEqual(soln_SET_STATE);
    });
    /* eslint-enable */
};

//  TESTING PLUGIN_CHANGE
// -------------------------
const test_PLUGIN_CHANGE = () => {
    const initialState = {
        '0': Timeline
    };
    deepFreeze(initialState);

    const solnState = Object.assign({}, Timeline);
    delete solnState['pluginVal'];
    solnState.pluginVal = 'Test_Plugin';
    deepFreeze(solnState);

    const test_PLUGIN_CHANGE = trialTable(
        initialState,
        {
            type: 'PLUGIN_CHANGE',
            openTrial: '0',
            pluginVal: 'Test_Plugin'
        });

    const soln_PLUGIN_CHANGE = {
        '0': solnState
    };

    /* eslint-disable */
    it('PLUGIN_CHANGE', () => {
        expect(test_PLUGIN_CHANGE).toEqual(soln_PLUGIN_CHANGE);
    });
    /* eslint-enable */
};

//  TESTING SELECT_TRIAL
// -------------------------
const test_SELECT_TRIAL = () => {
    const initialState = {
        '0': Timeline
    };
    deepFreeze(initialState);

    const solnState = Object.assign({}, Timeline);
    delete solnState.selected;
    solnState.selected = true;
    deepFreeze(solnState);

    const test_SELECT_TRIAL = trialTable(
        initialState,
        {
            type: 'SELECT_TRIAL',
            id: '0'
        });

    const soln_SELECT_TRIAL = {
        '0': solnState
    };

    /* eslint-disable */
    it('SELECT_TRIAL', () => {
        expect(test_SELECT_TRIAL).toEqual(soln_SELECT_TRIAL);
    });
    /* eslint-enable */
};

//  TESTING DESELECT_TRIAL
// -------------------------
const test_DESELECT_TRIAL = () => {
    const initialTimeline = Object.assign({}, Timeline);
    // Set selected to 'true' for this test
    delete initialTimeline.selected;
    initialTimeline.selected = true;

    const initialState = {
        '0': initialTimeline
    };
    deepFreeze(initialState);

    const solnState = Object.assign({}, Timeline);
    deepFreeze(solnState);

    const test_DESELECT_TRIAL = trialTable(
        initialState,
        {
            type: 'DESELECT_TRIAL',
            id: '0'
        });

    const soln_DESELECT_TRIAL = {
        '0': solnState
    };

    /* eslint-disable */
    it('DESELECT_TRIAL', () => {
        expect(test_DESELECT_TRIAL).toEqual(soln_DESELECT_TRIAL);
    });
    /* eslint-enable */
};

//  TESTING ADD_TRIAL
// -------------------------
const test_ADD_TRIAL = () => {
    const initialState = {
        '0': Timeline
    };
    deepFreeze(initialState);

    const solnTimeline = Object.assign({}, Timeline);
    deepFreeze(solnTimeline);

    // Get what will become the new trial
    const solnTrial = Object.assign({}, Trial);
    // Set the ID
    delete solnTrial.id;
    solnTrial.id = 2;
    // Set the trial name
    delete solnTrial.name;
    solnTrial.name = 'Trial_1';
    deepFreeze(solnTrial);

    const test_ADD_TRIAL = trialTable(
        initialState,
        {
            type: 'ADD_TRIAL',
            id: 2
        });

    const soln_ADD_TRIAL = {
        '0': solnTimeline,
        '2': solnTrial
    };

    /* eslint-disable */
    it('ADD_TRIAL', () => {
        expect(test_ADD_TRIAL).toEqual(soln_ADD_TRIAL);
    });
    /* eslint-enable */
};

// eslint-disable-next-line no-undef
describe('Testing trialTableReducers', () => {
    test_INITIAL_STATE();
    test_SET_STATE();
    test_PLUGIN_CHANGE();
    test_SELECT_TRIAL();
    test_DESELECT_TRIAL();
    test_ADD_TRIAL();
});
