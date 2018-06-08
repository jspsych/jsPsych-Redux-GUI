export const createUser = ({
	userId = null,
	username = null,
	email = null,
}={}) => ({
	// Cognito Identity Id
	userId: userId, 
	username: username,
	email: email,

	// osf access information
	osfAccess: [],

	// diy access information
	diyAccess: [],
})

const defaultFunction = (name) =>  ("function " + name +"(data) {\n\treturn undefined;\n}");
/**
 * jsPyschInit State Template
 * @namespace jsPyschInitState
 * @description Default state for jsPsych initial and lanch setting. 
 * @property {guiValue} display_element=jsPsych_Display_Element - 
 * The id of the document element that the experiment should be displaed in. See {@link http://www.jspsych.org/}
 * @property {number} default_iti=0 - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_finish - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_trial_start - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_trial_finish - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_data_update - See {@link http://www.jspsych.org/}
 * @property {StringifiedFunction} on_interaction_data_update - See {@link http://www.jspsych.org/}
 * @property {object} exclusions - See {@link http://www.jspsych.org/}
 * @property {number} exclusions.min_width=0 - See {@link http://www.jspsych.org/}
 * @property {number} exclusions.min_height=0 - See {@link http://www.jspsych.org/}
 * @property {boolean} exclusions.audio=false - See {@link http://www.jspsych.org/}
 * @property {boolean} show_progress_bar=false - See {@link http://www.jspsych.org/}
 * @property {boolean} show_update_progress_bar=true - See {@link http://www.jspsych.org/}
 * @property {boolean} show_preload_progress_bar=true - See {@link http://www.jspsych.org/}
 * @property {Array} preload_audio=[] - See {@link http://www.jspsych.org/}
 * @property {Array} preload_images=[] - See {@link http://www.jspsych.org/}
 * @property {number} max_load_time=60000 - See {@link http://www.jspsych.org/}
*/
export const getJspsychInitState = () => ({
	display_element: enums.jsPsych_Display_Element,
	default_iti: 0,
	on_finish: createFuncObj(defaultFunction("on_finish")),
	on_trial_start: createFuncObj(defaultFunction("on_trial_start")),
	on_trial_finish: createFuncObj(defaultFunction("on_trial_finish")),
	on_data_update: createFuncObj(defaultFunction("on_data_update")),
	on_interaction_data_update: createFuncObj(defaultFunction("on_interaction_data_update")),
	exclusions: {
		min_width: 0,
		min_height: 0,
		audio: false,
	},
	show_progress_bar: false,
	auto_update_progress_bar: true,
	show_preload_progress_bar: true,
	preload_audio: [],
	preload_images: [],
	max_load_time: 60000,
})

export const getDefaultInitCloudDeployInfo = () => ({
	osfNode: null,
	osfAccess: null, // check userState.osfAccess[i]
	saveAfter: 0
})

export const getDefaultInitDiyDeployInfo = () => ({
	mode: enums.DIY_Deploy_Mode.disk,
	saveAfter: 0,
})

export const getInitExperimentState = () => createExperiment({experimentId: null});

export const generateExperimentId = () => `experiment_${utils.getUUID()}`;

export const createExperiment = ({
	experimentName = "Untitled Experiment",
	ownerId = null,
	isPublic = false,
	experimentId = generateExperimentId()
}={}) => ({
	owner: null,
 	private: true,
	experimentDetails: {
		createdDate: null,
		lastEditDate: null,
		description: null,
	},

	/********** S3 Mappings **********/
	media: {},

	previewId: null,

	/////////////////////////////////////////


	
	experimentName: experimentName,
	experimentId: null,
	description: null,

	createDate: null,
	lastModifiedDate: null,
	ownerId: ownerId,
	isPublic: isPublic,

	/********** experiment contents **********/
	mainTimeline: [],
	jsPsychInit: getJspsychInitState(),

	/********** Deployment Information **********/
	cloudDeployInfo: getDefaultInitCloudDeployInfo(),
	diyDeployInfo: getDefaultInitDiyDeployInfo(),
})

const CodeLanguage = {
  // text: [null, 'Plain Text'],
  javascript: ['javascript', 'Javascript'],
  html: ['htmlmixed', 'HTML/Plain Text']
}

/**
 * @typeof {Object} StringifiedFunction
 * @classdesc Class representing a stringified function. This is created and used like an objecy 
 * because AWS.DynamoDB does not take functions.
 * The class is merely just for more maintainable code purpose.
 * @class
 * @public
*/
export class StringifiedFunction {
	/**
     * Create a stringified function
     * @param {guiValue} code - The code from user input
     * @param {boolean} ifEval - If the code should be evaluated when generating the deployment code
     * @param {CodeLanguageEnum} language - Tells the GUI (react-codemirror) which language mode should it use
     * @property {boolean} isFunc - Distinguish this object from other object, since AWS.DynamoDB does not store classes
     */
	constructor({code=null, ifEval=true, language=CodeLanguage.javascript[0]}) {
		this.code = code;
		// gui info (codeMirror language mode, eval info)
		this.ifEval = ifEval;
		this.language = language;
		this.isFunc = true;
	}
}

/**
 * @funcion createFuncObj
 * @desc Create a jsPsychValueObject
 * @param {guiValue} value=null
 * @param {StringifiedFunction} func=createFuncObject()
 * @param {ParameterModeEnum} mode=ParameterMode.USE_VAL
 * @returns {jsPsychValueObject}
*/
export const createFuncObj = (code=null, info=null) => (new StringifiedFunction({code: code, info: info}));