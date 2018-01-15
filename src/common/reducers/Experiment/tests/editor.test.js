/*
This file tests on ../editor.js

Following functions are tested:
setName
locateNestedParameterValue // untested
setPluginParam // untested
setPluginParamMode // untested
updateMedia 
changePlugin // omit
setSamplingMethod
setSampleSize
setRandomize
setRepetitions
setLoopFunction
setConditionFunction
updateTimelineVariableRow 
updateTimelineVariableCell 
updateTimelineVariableName 
addTimelineVariableRow 
addTimelineVariableColumn 
deleteTimelineVariableRow 
deleteTimelineVariableColumn 
*/

import * as Actions from '../../../actions/editorActions';
import { setNameAction } from '../../../actions/organizerActions';
import { deepCopy } from '../../../utils';
import * as editor from '../editor';
import { createFuncObj } from '../jsPsychInit';


if (!Array.prototype.move) {
  Array.prototype.move = function(from,to){
    this.splice(to,0,this.splice(from,1)[0]);
    return this;
  };
}

// Simplified version for test
const initState = {
	previewId: 'test0',
	test0: {
		id: 'test0',
		name: 'test0',
		parameters: deepCopy(editor.DEFAULT_TIMELINE_PARAM),
	},
	
}


describe('Set new name for timeline/trial nodes', () => {
	it('should handle setting new names for nodes', () => {
		let s1 = deepCopy(initState);
		const expected_setName = deepCopy(initState);
		const newName = 'test1'; 
		expected_setName.test0.name = newName;
		s1 = editor.setName(s1, setNameAction(newName));
		expect(s1).toEqual(expected_setName);
	})
})



describe('Locate nested/plain Parameter (of jsPsych) value', () => {
	it('should locate the right value of nested/plain jsPsych parameter', () => {
		const plainVal = 'value0';
		const nestedVal = 'value2';
		const ParameterValue = {
			'level1': {
				value: [{
					'level2': nestedVal
				}],
			},
			'level0': plainVal
		}
		const nestedPath = {
			next: {
				next: null,
				key: 'level2',
				position: 0,
			},
			key: 'level1',
			position: 0
		}
		const path = {
			key: 'level0'
		}
		expect(editor.locateNestedParameterValue(ParameterValue, path)).toEqual(plainVal);
		expect(editor.locateNestedParameterValue(ParameterValue, nestedPath)).toEqual(nestedVal);
	})
})


describe('A set of actions that set timeline parameter properties', () => {
	it('should set sampling method/size, repetitions, loop/conditional function, randomize_order', () => {
		let newMethod = "test";
		let expected = deepCopy(initState);
		expected['test0'].parameters.sample.type = newMethod;
		
		let s1 = deepCopy(initState);
		s1 = editor.setSamplingMethod(s1, Actions.setSamplingMethodAction('', newMethod));
		expect(s1).toEqual(expected);
	})

	it('should set sampling size', () => {
		let newSize = 5;
		let expected = deepCopy(initState);
		expected['test0'].parameters.sample.size = newSize;
		
		let s1 = deepCopy(initState);
		s1 = editor.setSampleSize(s1, Actions.setSampleSizeAction(newSize));
		expect(s1).toEqual(expected);
	})

	it('should set randomize_order', () => {
		let newRandomize_order = false;
		let expected = deepCopy(initState);
		expected['test0'].parameters.randomize_order = newRandomize_order; 
		
		let s1 = deepCopy(initState);
		s1 = editor.setRandomize(s1, Actions.setRandomizeAction(newRandomize_order));
		expect(s1).toEqual(expected);
	})

	it('should set repetitions', () => {
		let newRepetitions = 5;
		let expected = deepCopy(initState);
		expected['test0'].parameters.repetitions = newRepetitions;
		
		let s1 = deepCopy(initState);
		s1 = editor.setRepetitions(s1, Actions.setRepetitionsAction(newRepetitions));
		expect(s1).toEqual(expected);
	})

	it('should set loop function', () => {
		let newFunction = createFuncObj('function');
		let expected = deepCopy(initState);
		expected['test0'].parameters.loop_function = deepCopy(newFunction);
		
		let s1 = deepCopy(initState);
		s1 = editor.setLoopFunction(s1, Actions.setLoopFunctionAction('function'));
		expect(s1).toEqual(expected);
	})

	it('should set conditional function', () => {
		let expected = deepCopy(initState);
		expected['test0'].parameters.conditional_function = createFuncObj('function');
		
		let s1 = deepCopy(initState);
		s1 = editor.setConditionFunction(s1, Actions.setConditionFunctionAction('function'));
		expect(s1).toEqual(expected);
	})
})

describe('Test update s3 media file object', () => {
	it('should set s3 media file object', () => {
		let s3 = {"test": 1};
		let initState = {'media': {}};
		let expected = {'media': deepCopy(s3)};
		let s1 = editor.updateMedia(initState, Actions.updateMediaAction(s3));
		expect(s1).toEqual(expected);
	})
})

describe('Test operations on timeline variables', () => {
	it('should add row', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)},
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)}
		];
		s1 = editor.addTimelineVariableColumn(s1);
		s1 = editor.addTimelineVariableRow(s1, Actions.addTimelineVariableRowAction(1));
		expect(s1).toEqual(expected);
	})

	it('should add column', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)},
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)}
		]
		s1 = editor.addTimelineVariableRow(s1, Actions.addTimelineVariableRowAction(1));
		s1 = editor.addTimelineVariableColumn(s1);
		expect(s1).toEqual(expected);
	})

	it('should delete column', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		s1 = editor.addTimelineVariableColumn(s1);
		s1 = editor.deleteTimelineVariableColumn(s1, Actions.deleteTimelineVariableColumnAction(1));
		expect(s1).toEqual(expected);
	})

	it('should delete row', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		s1 = editor.addTimelineVariableRow(s1, Actions.addTimelineVariableRowAction(1));
		s1 = editor.deleteTimelineVariableRow(s1, Actions.deleteTimelineVariableRowAction(1));
		expect(s1).toEqual(expected);
	})

	it('should update variable name', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null), "V2": editor.createComplexDataObject(null)},
			{"V0": editor.createComplexDataObject(null), "V2": editor.createComplexDataObject(null)}
		];
		s1 = editor.addTimelineVariableColumn(s1);
		s1 = editor.addTimelineVariableRow(s1, Actions.addTimelineVariableRowAction(1));
		s1 = editor.updateTimelineVariableName(s1, Actions.updateTimelineVariableNameAction("V1", "V2"));
		expect(s1).toEqual(expected);
	})

	it('should update timeline varible cell [function code]', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null)}
		];
		expected['test0'].parameters.timeline_variables[0]["V0"].func.code = "test code";
		s1 = editor.updateTimelineVariableCell(s1, Actions.updateTimelineVariableCellAction(0, 0, false, 'test code'));
		expect(s1).toEqual(expected);
	})

	it('should update timeline varible cell [function toggle]', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null)}
		];

		expected['test0'].parameters.timeline_variables[0]["V0"].mode = editor.ParameterMode.USE_FUNC;
		s1 = editor.updateTimelineVariableCell(s1, Actions.updateTimelineVariableCellAction(0, 0, true, 'test code'));
		expect(s1).toEqual(expected);
	})

	it('should update timeline varible row', () => {
		let s1 = deepCopy(initState);
		let expected = deepCopy(initState);
		expected['test0'].parameters.timeline_variables = [
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)},
			{"V0": editor.createComplexDataObject(null), "V1": editor.createComplexDataObject(null)}
		];

		expected['test0'].parameters.timeline_variables[0]["V0"].value = "r1c1";
		expected['test0'].parameters.timeline_variables[0]["V1"].value = "r1c2";
		expected['test0'].parameters.timeline_variables[1]["V0"].value = "r1c1";
		expected['test0'].parameters.timeline_variables[1]["V1"].value = "r1c2";
		let update = {"V0": editor.createComplexDataObject("r1c1"), "V1": editor.createComplexDataObject("r1c2")};
		s1 = editor.addTimelineVariableColumn(s1);
		s1 = editor.addTimelineVariableRow(s1, Actions.addTimelineVariableRowAction(1));
		s1 = editor.updateTimelineVariableRow(s1, Actions.updateTimelineVariableRowAction(0, 1, update));
		expect(s1).toEqual(expected);
	})
})