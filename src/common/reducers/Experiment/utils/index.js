// track id
var timelineId = 0;
var trialId = 0;
var index = 2; 

const TIMELINE_ID_PREFIX = "TIMELINE-";
const TRIAL_ID_PREFIX = "TRIAL-";

export const TIMELINE_TYPE = "TIMELINE";
export const TRIAL_TYPE = "TRIAL";


export const standardizeTimelineId = (id) => {
	if (isNaN(id))
		throw new TypeError("Should pass in a number!");
	return TIMELINE_ID_PREFIX + id;
}

export const standardizeTrialId = (id) => {
	if (isNaN(id))
		throw new TypeError("Should pass in a number!");
	return TRIAL_ID_PREFIX + id;
}

export function getTimelineId() {
	return standardizeTimelineId(timelineId++);
}

export function getTrialId() {
	return standardizeTrialId(trialId++);
}

export function startFromTwo(array, index) {
	if(array[0] !== array[1]) {
		index = 2;
	} else {
		index++;
	}

	return index;
}

export const isTimeline = (node) => (node.type === TIMELINE_TYPE);

export const isTrial = (node) => (node.type === TRIAL_TYPE);

export function arrayOfArrays(arrayOfObjects) {
	var newArray = [];
	var headers = Object.keys(arrayOfObjects[0]);
	var firstRow = [];
	//For each object in the array
	for(let i=0; i<headers.length; i++) { 
		firstRow.push(headers[i]);
	}
	newArray.push(firstRow);

	var currentArray;
	//For each object in array
	for(let i=0; i<arrayOfObjects.length; i++) {
		newArray.push([]);
		//For each column in array
		for(let j=0; j<headers.length; j++) {
			currentArray = arrayOfObjects[i];
			newArray[i+1][j] = currentArray[headers[j]];
		}
	}
	return newArray;
}

export function arrayOfObjects(arrayOfArrays) {
	var array = [];
	var headers = arrayOfArrays[0];
	var currentObj;
	//For number of rows
	for(let i=0; i<(arrayOfArrays.length-1); i++) {
		array.push({});
		//For number of headers
		for(let j=0; j<arrayOfArrays[0].length; j++) {
			let currentHeader = headers[j]; 
		 	currentObj = array[i]; 
		 	currentObj[headers[j]] = arrayOfArrays[i+1][j];
		 	array[i] = currentObj;
		}
	}

	return array;
}

//Takes in an array of rows
export function arrayOfColumns(arrayOfRows) {
	var array = [];

	for(let i=0; i<arrayOfRows[0].length; i++) {
		array.push([]);
	}

	//For each row
	for(let i=0; i<arrayOfRows.length; i++) {
		//For each element in each row
		for(let j=0; j<arrayOfRows[0].length; j++) {
			array[j].push(arrayOfRows[i][j]); 
		}
	}
	console.log(array);
	return array;
}

export function backToArrayOfArrays(arrayOfColumns) {
	var array = [];

	for(let i=0; i<arrayOfColumns[0].length; i++) {
		array.push([]);
	}

	for(let i=0; i<arrayOfColumns.length; i++) {
		for(let j=0; j<arrayOfColumns[0].length; j++) {
			array[j].push(arrayOfColumns[i][j]);	
		}
	}

	return array;
}