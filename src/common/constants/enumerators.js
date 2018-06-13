export const DIY_Deploy_Mode = {
  disk: 'save_to_disk_as_csv',
  sqlite: 'save_to_sqlite',
  mysql: 'save_to_mysql'
}

export const Login_Modes = {
	signIn: 0,
	register: 1,
	verification: 2,
	forgotPassword: 3,
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

/**
 * @enum {string}
 * @constant
 * @default
*/
export const jsPsych_Display_Element = "jsPsych-Window";