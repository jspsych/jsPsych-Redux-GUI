import openTrial from '../src/reducers/openTrialReducers.jsx';
import deepFreeze from 'deep-freeze';


//  TESTING INITIAL_STATE
// -------------------------
const test_INITIAL_STATE = () => {
    const state = 4; 
    deepFreeze(state);
    const test_INITIAL_STATE = openTrial(state, { type: 'INITIAL_STATE' });
    const soln_INITIAL_STATE = -1;
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('INITIAL_STATE', () => {
        expect(test_INITIAL_STATE).toEqual(soln_INITIAL_STATE);
    });
    /* eslint-enable */
};

//  TESTING CLOSE_DRAWER
// -------------------------
const test_CLOSE_DRAWER = () => {
    const state = 4;
    deepFreeze(state);
    const test_CLOSE_DRAWER = openTrial(state, 
        {
            type: 'CLOSE_DRAWER',
            id: 4
        });
    const soln_CLOSE_DRAWER = -1;
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('CLOSE_DRAWER', () => {
        expect(test_CLOSE_DRAWER).toEqual(soln_CLOSE_DRAWER);
    });
    /* eslint-enable */
};

//  TESTING SET_STATE
// -------------------------
const test_SET_STATE = () => {
    const state = -1;
    deepFreeze(state);
    const test_SET_STATE = openTrial(state, 
        {
            type: 'SET_STATE',
            state: { openTrial: 4 }
        });
    const soln_SET_STATE = 4;
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('SET_STATE', () => {
        expect(test_SET_STATE).toEqual(soln_SET_STATE);
    });
    /* eslint-enable */
};

//  TESTING OPEN_DRAWER
// -------------------------
const test_OPEN_DRAWER = () => {
    const state = -1;
    deepFreeze(state);
    const test_OPEN_DRAWER = openTrial(state, 
        {
            type: 'OPEN_DRAWER',
            id: 4
        });
    const soln_OPEN_DRAWER = 4;
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('OPEN_DRAWER', () => {
        expect(test_OPEN_DRAWER).toEqual(soln_OPEN_DRAWER);
    });
    /* eslint-enable */
};

//  TESTING SET_OPEN_TRIAL
// -------------------------
const test_SET_OPEN_TRIAL = () => {
    const state = -1;
    deepFreeze(state);
    const test_SET_OPEN_TRIAL = openTrial(state, 
        {
            type: 'SET_OPEN_TRIAL',
            id: 4
        });
    const soln_SET_OPEN_TRIAL = 4;
    // The comment block below prevents eslint from complaining
    // about 'it' and 'expect' being undefined. 
    // (They are defined implicitly by jest)

    /* eslint-disable */
    it('SET_OPEN_TRIAL', () => {
        expect(test_SET_OPEN_TRIAL).toEqual(soln_SET_OPEN_TRIAL);
    });
    /* eslint-enable */
};

// This will run all the tests when 'npm test' is executed in the
// root directory of the repository
// eslint-disable-next-line no-undef
describe('Testing trialOrderReducers', () => {
    test_INITIAL_STATE();
    test_CLOSE_DRAWER();
    test_SET_STATE();
    test_OPEN_DRAWER();
    test_SET_OPEN_TRIAL();
});
