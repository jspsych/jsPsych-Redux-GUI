/*
This file tests jsPsychInit.js

*/

import { initState } from '../';
import reducer from '../';

import { deepCopy } from '../../../utils';
import * as Actions from '../../../actions/experimentSettingActions';
import { settingType, createFuncObj } from '../jsPsychInit';


let expected = deepCopy(initState);
for (var key of Object.keys(settingType)) {
	switch(key) {
		case settingType.on_finish:
		case settingType.on_data_update:
		case settingType.on_trial_start:
		case settingType.on_trial_finish:
		case settingType.on_interaction_data_update:
			expected.jsPsychInit[key] = createFuncObj(key);
			break;
		case settingType.min_width:
			expected.jsPsychInit.exclusions.min_width = key;
			break;
		case settingType.min_height:
			expected.jsPsychInit.exclusions.min_height = key;
			break;
		case settingType.audio:
			expected.jsPsychInit.exclusions.audio = !expected.jsPsychInit.exclusions.audio;
			break;
		case settingType.show_progress_bar:
		case settingType.auto_update_progress_bar:
		case settingType.show_preload_progress_bar:
			expected.jsPsychInit[key] = !expected.jsPsychInit[key];
			break;
		default:
			expected.jsPsychInit[key] = key;
	}
}

describe('Set jsPysch Init Properties', () => {
	it('should editing jsPsych Init properties for the experiment', () => {
		let s1 = deepCopy(initState);
		for (var key of Object.keys(settingType)) {
			s1 = reducer(s1, Actions.setJspyschInitAction(key, key));
		}
		expect(s1).toEqual(expected);
	})
})