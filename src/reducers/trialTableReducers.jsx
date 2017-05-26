// The default configuration for a new trial
export const Trial = {
    id: 0,
    name: 'default',
    pluginVal: 'text',
    paramVal: '',
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
    paramVal: '',
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

        // Update the name
        delete newTrial.name;
        newTrial.name = action.name;

        // Update the id
        delete newTrial.id;
        newTrial.id = action.index;

        // Add the new trial to the top level
        var newTable = Object.assign({}, state);
        newTable[action.index] = newTrial;

        // Return
        return newTable;
    case 'DUPLICATE_CHILD_TRIAL':
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
        var newParent = Object.assign({}, state[action.parentTrial]);

        // Get the index of the trial being copied in the parent's timeline
        var index = newParent.timeline.indexOf(action.copyFrom);

            // Update the parent's info
            newParent.timeline = [
                ...newParent.timeline.slice(0, index+1),
                action.index,
                ...newParent.timeline.slice(index+1)
            ];

            console.log('parents timeline', newParent.timeline);

        // Copy the current trialTable
        var newTable = Object.assign({}, state);

        // Update the trial table with the parent
        delete newTable[action.parentTrial];
        newTable[action.parentTrial] = newParent;

        // Add the new Trial
        newTable[action.index] = newTrial;

            console.log(newTable);
        // Return
        return newTable;
    case 'ADD_TRIAL':
            // New trial's name 
            var newName = 'Trial_' + Object.keys(state).length;

            // Make the new trial from the default template.
            var newTrial = Object.assign({}, Trial);

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

        // Get the trial's parentTrial
        var parentTrial = state[action.ID].parentTrial;
        var newparentTrial = Object.assign({}, state[parentTrial]);

        var index = newparentTrial.timeline.indexOf(action.ID);

        // Remove trial from the parent's timeline but not the 
        // trialTable 
        // Handle removeing the last child
        if (newparentTrial.timeline.length == 1){
          newparentTrial.timeline = [];
          // Otherwise just remove the trial at index
        } else {
          newparentTrial.timeline = [
            ...newparentTrial.timeline.slice(0, index),
            ...newparentTrial.timeline.slice(index+1)
          ];
        }

        console.log(newparentTrial);
        delete newState[action.ID];
        delete newState[parentTrial];

        newState[parentTrial] = newparentTrial;

        return newState;
    case 'REMOVE_TRIAL_FROM_TIMELINE':
        var newState = Object.assign({}, state);

        // Get the trial's parent
        var parentID = state[action.ID].parentTrial;
        var newParent = Object.assign({}, state[parentID]);

        var index = newParent.timeline.indexOf(action.ID);
        newParent.timeline = [
          ...newParent.timeline.slice(0, index),
          ...newParent.timeline.slice(index+1)
        ];
        delete newState[parentID];
        newState[parentID] = newParent;

        return newState;
        // Update the ancestry
    case 'INSERT_TRIAL_INTO_TRIALORDER':
        var newState = Object.assign({}, state);
        var newTrial = Object.assign({}, state[action.id]);
        delete newTrial.ancestry;
        delete newTrial.parentTrial;
        newTrial.ancestry = [];
        newTrial.parentTrial = -1;

        delete newState[action.id];
        newState[action.id] = newTrial;

        return newState;
    case 'INSERT_TRIAL_IN_TIMELINE':
        var newState = Object.assign({}, state);
            // If the trial is being moved to the top level
            if(newState[action.toPos].parentTrial === -1) {

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
                var parent = newState[action.toPos].parentTrial;
                var oldTimeline = newState[parent].timeline;
                var newTimeline = [
                    ...oldTimeline.slice(0, oldTimeline.indexOf(action.toPos)),
                    action.fromPos,
                    ...oldTimeline.slice(oldTimeline.indexOf(action.toPos))
                ];

                // Update the new Parent
                var newParent = Object.assign({}, newState[parent]);

                delete newParent['timeline'];
                newParent['timeline'] = newTimeline;

                // Update the properties of the trial
                var newTrial = Object.assign({}, state[action.fromPos]);
                delete newTrial['parentTrial'];
                delete newTrial['ancestry'];
                newTrial['parentTrial'] = parent;

                // Add the parent to the child's ancestry
                newTrial['ancestry'] = [
                    parent,
                    ...newParent.ancestry
                ];

                // Update the
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

        newState[action.openTrial] = Object.assign({}, newTrial);
        return newState;
    case 'CHANGE_NAME':
        var newState = Object.assign({}, state);
        var newTrial = Object.assign({}, state[action.openTrial]);

        delete newTrial.name;
        newTrial.name = action.name;

            // action.name is the new name of the trial.
        delete newState[action.openTrial];

        newState[action.openTrial] = newTrial;

        return newState;
    case 'PARAM_CHANGE':
        var newState=Object.assign({}, state);
        var newTrial = Object.assign({}. state[action.openTrial]);

        delete newTrial.pluginVal;
        newTrial.pluginVal = action.pluginVal; 

        delete newState[action.openTrial];

        newState[action.openTrial] = newTrial;

        default:
            return state;
    }
};

export default trialTable;
