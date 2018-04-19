import * as actionTypes from '../constants/ActionTypes';

export const setExperimentNameAction = (name) => ({
	type: actionTypes.SET_EXPERIMENT_NAME,
	name: name,
});

export function setJspyschInitAction(key, value) {
	return {
		type: actionTypes.SET_JSPSYCH_INIT,
		key: key,
		value: value,
	};
}

export function setCloudDeployInfoAction(cloudDeployInfo) {
	return {
		type: actionTypes.SET_CLOUD_DEPLOY_INFO,
		cloudDeployInfo: cloudDeployInfo
	}
}

export function setDIYDeployInfoAction(diyDeployInfo) {
	return {
		type: actionTypes.SET_CLOUD_DEPLOY_INFO,
		diyDeployInfo: diyDeployInfo
	}
}