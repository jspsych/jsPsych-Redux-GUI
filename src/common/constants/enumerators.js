export const DIY_Deploy_Mode = {
  disk: 'save_to_disk_as_csv',
  sqlite: 'save_to_sqlite',
  mysql: 'save_to_mysql'
}

export const Notify_Type = {
	success: "success",
	warning: "warning",
	error: "error",
	confirm: "confirm"
}

export const AUTH_MODES = {
	signIn: 'signIn',
	register: 'register',
	verification: 'verification',
	forgotPassword: 'forgotPassword'
}

export const MediaManagerMode = {
	upload: 'Upload',
	select: 'Select',
	multiSelect: 'multi-Select'
}

/**
 * @typeof {string} ParameterModeEnum
 * @description Indicate which value (native value, function or timeline variable) should be used
 * @readonly
 * @enum {string}
*/
export const ParameterMode = {
    /** The value that indicates deployment function should interpret the value as function when generating the code */
    USE_FUNC: 'USE_FUNC',
    /** The value that indicates deployment function should interpret the value as timeline variable when generating the code */
    USE_TV: "USE_TIMELINE_VARIABLE",
    /** The value that indicates deployment function should interpret the value as native javascript value when generating the code */
    USE_VAL: "USE_VALUE"
}

/**
 * @typeof {string} GuiIgnoredInforEnum
 * @readonly
 * @enum {string}
 * @description The object that holds enumerators for information that will not be evaluated when generating deployment code
*/
export const TimelineVariableInputType = {
    // string
    TEXT: 'String',
    NUMBER: 'Number',
    LONG_TEXT: 'HTML/Long String',
    // string, but use special editor
    MEDIA: 'Media Resources',
    OBJECT: 'Object',
    ARRAY: 'Array',
    FUNCTION: 'Function'
}

/**
 * @enum {string}
 * @constant
 * @default
*/
export const jsPsych_Display_Element = "jsPsych-Window";