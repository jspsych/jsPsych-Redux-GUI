import * as actionTypes from '../constants/ActionTypes';

export function setOsfAccessAction(osfAccess) {
	return {
		type: actionTypes.SET_OSF_ACCESS,
		osfAccess: osfAccess
	}
}
