
// The default configuration for a new trial
export const Trial = {
    id: 0,
    name: 'default',
    pluginVal: 'text',
    isTimeline: false,
    timeline: [],
    trialType: 'trialType',
    parentTrial: -1,
    ancestry: [],
    selected: false
};

export const Timeline = {
    id: 0,
    name: 'default',
    pluginVal: 'text',
    isTimeline: true,
    timeline: [],
    trialType: 'trialType',
    parentTrial: -1,
    ancestry: [],
    selected: false
};


// Reducers for modifiying the trialTable sotre property
const trialTable = (state = { Trial }, action) => {
    switch(action.type) {
    case 'INITIAL_STATE':
        var newState = {
            '0': Timeline
        };
        return newState;
    case 'SET_STATE':
        var newState = Object.assign({}, action.state.trialTable);
        return newState;
    case 'PLUGIN_CHANGE':
        var newState = Object.assign({}, state);
            // Get the new trial
        var newTrial = Object.assign({}, state[action.openTrial]);

            // Remove the old plugin value
        delete newTrial.pluginVal;

            // Set the new value
        newTrial.pluginVal = action.pluginVal;

        delete newState[action.openTrial];

        newState[action.openTrial] = newTrial;

        return newState;
    case 'SELECT_TRIAL':
        // Make the updated the trial property by constructing a new hashtable
        var newTrial = Object.assign({}, state[action.id]);

        delete newTrial['selected'];
        newTrial['selected'] = true;

        var newState = Object.assign({}, state);
        delete newState[action.id];
        newState[action.id] = newTrial;

        return newState;
    case 'DESELECT_TRIAL':
            // Make the updated the trial property by constructing a new hashtable
        var newTrial = Object.assign({}, state[action.id]);
        delete newTrial.selected;
        newTrial.selected = false;

        var newState = Object.assign({}, state);
        delete newState[action.id];
        newState[action.id] = newTrial;

        return newState;

    case 'DUPLICATE_TRIAL':

        // Copy the trial being duplicated
        var newTrial = Object.assign({}, state[action.copyFrom]);

        console.log(newTrial);

        // Update the name
        delete newTrial.name;
        newTrial.name = action.name;

        // Update the id
        delete newTrial.id;
        newTrial.id = action.index;

        // Add the new trial to the top level
        var newTable = Object.assign({}, state);
        newTable[action.index] = Object.assign({}, newTrial);

        // Return
        return newTable;

    case 'DUPLICATE_CHILD_TRIAL':

        console.log("Action child duplicate", action);

        // Copy the trial being duplicated
        var newTrial = Object.assign({}, state[action.copyFrom]);

        // Update the name
        delete newTrial.name
        newTrial.name = action.name;

        // Update the id
        delete newTrial.id;
        newTrial.id = action.index;

            // Add the new trial to the same timeline
            // as the trial being duplicated
        var newTable = Object.assign({}, state);

        var newParent = Object.assign({}, state[action.parentTrial]);

        // Get the index of the trial being copied in the parent's timeline
        var index = newParent.timeline.indexOf(action.copyFrom.id);

        // Add the new trial's id
        var newTimeline = [
            ...newParent.timeline.slice(0, index+1),
            action.index,
            ...newParent.timeline.slice(index+1)
        ];

        // Update the parent's info
        delete newParent.timeline;
        newParent.timeline = newTimeline;

        // Copy the current trialTable
        var newTable = Object.assign({}, state);

        // Update the trial table with the parent
        delete newTable[action.parentTrial];
        newTable[action.parentTrial] = newParent;

        // Add the new Trial
        newTable[action.id] = newTrial;

        // Return
        return newTable;


    case 'ADD_TRIAL':
            // New trial's name 
        var newName = 'Trial_' + Object.keys(state).length;

            // Make the new trial from the default template.
        var newTrial = Object.assign({}, Trial);
        console.log("New Trial", newTrial)

            // Delete is okay as these shallow copies are not yet part
            // of the state. 
        delete newTrial['name'];
        delete newTrial['id'];

            // Add the new properties
        newTrial['id'] = action.id;
        newTrial['name'] = newName;

            // Create the new trial table
        var newState = Object.assign({}, state);
        newState[action.id] = newTrial;

        return newState;
    case 'REMOVE_TRIAL':
            // Create deep copy of the state.
        var newState = Object.assign({}, state);
        var removeList = action.toRemove;

            // Find and remove all the selected trials
        for(var i = 0; i < removeList.length; i++){
            var trial = removeList[i];

            if (state[trial].selected) {
                    // if the trial has children 
                if (state[trial].timeline.length > 0) {
                        // Delete the children 
                    for (var j = 0; j < state[trial].length; j++) {
                        var child = state[trial].timeline[j];
                        delete newState[child];
                    }
                }

                    // IF the trial is not on the top level
                if (state[trial].parentTrial !== -1) {
                    var parent = state[trial].parentTrial;
                    var newParent = state[parent];
                    var childIndex = newParent.timeline.indexOf(trial); 
                    var newChildren = [
                        ...newParent.timeline.slice(0, childIndex),
                        ...newParent.timeline.slice(childIndex+1)
                    ];

                    delete newParent['timeline'];
                    newParent['timeline'] = newChildren;
                    delete newState[parent];
                    newState[parent] = Object.assign({}, newParent);
                }
                delete newState[trial]; 
            }
        }

            // If all the trial are removed add the default trial
        if (Object.keys(newState).length == 0){
            newState.trialTable = {
                [Trial.id]: Trial
            };
        }
        return newState;
    case 'ADD_CHILD_TRIAL':
            // New trial's name 
        var newName = 'Trial_' + Object.keys(state).length;

            // Make the new trial from the default template.
        var newTrial = Object.assign({}, Trial);

            // Make the new Table
        var newState = Object.assign({}, state);
            // Delete is okay as these shallow copies are not yet part
            // of the state. 
        delete newTrial['name'];
        delete newTrial['id'];
        delete newTrial['parentTrial'];
        delete newTrial['ancestry'];

            // Add the new properties
        newTrial['id'] = action.index;
        newTrial['name'] = newName;
        newTrial['parentTrial'] = action.ID; 
        newTrial['ancestry'] = [
            action.ID,
            ...state[action.ID].ancestry
        ];

            // Add the new trial to the trial table
        newState[action.index] = newTrial;

            // Create the new child timeline 
        var newChildren = [
            ...state[action.ID].timeline,
            action.index
        ];

            // Create the new parent
        var newParent = Object.assign({}, state[action.ID]);
            // Delete its old children
        delete newParent['timeline'];
            // Assign the new Children
        newParent['timeline'] = newChildren;

            // Delete the old parent Trial
        delete newState[action.ID];
            // Assign the new parent 
        newState[action.ID] = newParent;

        return newState;
    case 'REMOVE_CHILD_TRIAL':
        var newState = Object.assign({}, state);

            // Get the trial's parent
        var parent = state[action.ID].parentTrial;
        var newParent = Object.assign({}, state[parent]);

        var index = newParent.timeline.indexOf(action.ID);
        newParent.timeline = [
            ...newParent.timeline.slice(0, index),
            ...newParent.timeline.slice(index+1)
        ];

        delete newState[action.ID];
        delete newState[parent];

        newState[parent] = newParent;

        return newState;
    case 'MOVE_TRIAL':
        var newState = Object.assign({}, state);

            //////// UPDATE WHERE THE TRIAL IS MOVED FROM ////////

            // If fromPos and toPos are the same don't do anything
        if (action.fromPos === action.toPos) {
            return newState;
        }
            // If the trial is being moved from the top level

            // Otherwise it's being moved from a parent  
        else if (state[action.fromPos].parentTrial !== -1) {
                // Modify the parent
            var parent = state[action.fromPos].parentTrial;
            var oldTimeline = state[parent].timeline;

                // Update the Parent
            var newTimeline = [
                ...oldTimeline.slice(0, oldTimeline.indexOf(action.fromPos)),
                ...oldTimeline.slice(oldTimeline.indexOf(action.fromPos)+1)
            ];
            var newParent = Object.assign({}, state[parent]);
            delete newParent['timeline'];
            newParent['timeline'] = newTimeline;

                // Update the trial table with the modified parent
            delete newState[parent];
            newState[parent] = Object.assign({}, newParent);
        }

            //////// UPDATE WHERE THE TRIAL IS MOVED TO ////////

            // If the trial is being moved to the top level
        if(newState.trialTable[action.toPos].parentTrial === -1) {

                // Update the properties of the trial
            var newTrial = Object.assign({}, state[action.fromPos]);
            delete newTrial['parentTrial'];
            delete newTrial['ancestry'];
            newTrial['parentTrial'] = -1;
            newTrial['ancestry'] = [];

                // Update the trialTable
            var newState = Object.assign({}, state);
            delete newState[action.fromPos];
            newState[action.fromPos] = newTrial;
        }
        else // Otherwise the trial is being moved to a new parent
            {
            var parent = newState.trialTable[action.toPos].parentTrial;
            var oldTimeline = newState.trialTable[parent].timeline;
            var newTimeline = [
                ...oldTimeline.slice(0, oldTimeline.indexOf(action.toPos)),
                action.fromPos,
                ...oldTimeline.slice(oldTimeline.indexOf(action.toPos))
            ];
                // Update the new Parent
            var newParent = Object.assign({}, newState.trialTable[parent]);
            delete newParent['timeline'];
            newParent['timeline'] = newTimeline;

                // Update the properties of the trial
            var newTrial = Object.assign({}, state[action.fromPos]);
            delete newTrial['parentTrial'];
            delete newTrial['ancestry'];
            newTrial['parentTrial'] = parent;
            newTrial['ancestry'] = [
                parent,
                ...newParent.ancestry
            ];

                // Update the trialTable
            delete newState[action.fromPos];
            delete newState[parent];
            newState[action.fromPos] = newTrial;
            newState[parent] = newParent;
        }

        return newState;
    case 'MAKE_TRIAL':
        var newState = Object.assign({}, state);

        var newTrial = Object.assign({}, newState[action.openTrial]);
        // Delete and update the isTimeline property
        delete newTrial.isTimeline;
        newTrial.isTimeline = false;

        // Delete the previous version of the trial
        delete newState[action.openTrial];

        newState[action.openTrial] = Object.assign({}, newTrial);
        return newState;
    case 'MAKE_TIMELINE':
        var newState = Object.assign({}, state);

        const newTrial = Object.assign({}, state[action.openTrial]);
        // Delete and update the isTimeline property
        delete newTrial.isTimeline;
        newTrial.isTimeline = true;

        // Delete the previous version of the trial
        delete newState[action.openTrial];

        newState[action.openTrial] = Object.assign({}, newTrial);
        return newState;
    case 'CHANGE_NAME':
        var newState = Object.assign({}, state);
        var newTrial = Object.assign({}, state[action.state.openTrial]);

        delete newTrial[name];
        newTrial[name] = action.name;

            // action.name is the new name of the trial.
        delete newState[newState.openTrial];

        newState[newState.openTrial] = newTrial;

        return newState;
    default:
        return state;
    }
};

export default trialTable;
