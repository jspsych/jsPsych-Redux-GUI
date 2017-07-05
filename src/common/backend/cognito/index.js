/*
This file handles login using APIs of cognito. 

Possibly related files:
reducers/User/index.js
containers/Login/*
*/
import { cognitoConfig } from '../../../../config/aws-config-cognito.js';
import {
	CognitoUser,
	CognitoUserPool,
	AuthenticationDetails,
	CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import AWS from '../aws';


export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});


function clearAWSCredentialCache() {
	AWS.config.credentials.clearCachedId();
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: cognitoConfig.IdentityPoolId,
	});
}


export function login(username, authenticationData, fetchCredentialCallback, onFailure) {
	var authenticationDetails = new AuthenticationDetails(authenticationData);
	var cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: (result) => {
					fetchCredential(cognitoUser, fetchCredentialCallback)
				},
		onFailure: onFailure
	})
}

/*
callback = (err, res) => {}

*/
export function signUp(username, password, attributes, callback) {

	var attributeList = [];
	for (let attribute of attributes) {
		attributeList.push(new CognitoUserAttribute(attribute));
	}

	userPool.signUp(username,
		password,
		attributeList,
		null, callback);
}

export function verify(username, code, callback) {
	var cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});
	cognitoUser.confirmRegistration(code, false, callback);
}

export function resendVerification(username, callback) {
	var cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});
	cognitoUser.resendConfirmationCode(callback);
}

export function forgotPassword(username, onSuccess, onFailure, inputVerificationCode) {
	let cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});

	cognitoUser.forgotPassword({
        onSuccess: onSuccess,
        onFailure: onFailure,
        inputVerificationCode: inputVerificationCode
    });
}

export function forgotPasswordReset(username, verificationCode, newPassword, callback) {
	let cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});
	cognitoUser.confirmPassword(verificationCode, newPassword, callback);
}

const LoginsKey = 'cognito-idp.' + cognitoConfig.region + '.amazonaws.com/' + cognitoConfig.UserPoolId;
export function fetchCredential(cognitoUser = null, callback = () => {}) {
	if (!cognitoUser) {
		cognitoUser = userPool.getCurrentUser();
		if (!cognitoUser) {
			return;
		}
	}

	cognitoUser.getSession((err, result) => {
		if (err) {
			console.log(err.message);
			return;
		}
		if (result) {

			let Logins = {};
			Logins[LoginsKey] = result.getIdToken().getJwtToken();
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				IdentityPoolId: cognitoConfig.IdentityPoolId,
				Logins: Logins
			});

			AWS.config.credentials.refresh((error) => {
				if (error) {
					console.error(error);
					return;
				} else {
					callback();
				}
			});
		}
	});
}

const cogLocalBaseKey = 'CognitoIdentityServiceProvider.' + cognitoConfig.ClientId + '.';
const lastAuthUserKey = cogLocalBaseKey + 'LastAuthUser';
export function getLoginSessionFromCognito() {
	let lastAuthUser = window.localStorage[lastAuthUserKey];
	let accessTokenkey = cogLocalBaseKey + lastAuthUser + '.accessToken'
	let idTokenkey = cogLocalBaseKey + lastAuthUser + '.idToken'
	let refreshTokenkey = cogLocalBaseKey + lastAuthUser + '.refreshToken'

	return {
		accessToken: (AWS.config.credentials) ? AWS.config.credentials.storage[accessTokenkey] : undefined,
		idToken: (AWS.config.credentials) ? AWS.config.credentials.storage[idTokenkey] : undefined,
		refreshToken: (AWS.config.credentials) ? AWS.config.credentials.storage[refreshTokenkey] : undefined,
	}
}

export function getUserInfoFromCognito() {
	return {
		username: (AWS.config.credentials) ? AWS.config.credentials.storage[lastAuthUserKey] : undefined,
		identityId: (AWS.config.credentials) ? AWS.config.credentials.identityId : undefined,
	}
}

export function logout() {
	userPool.getCurrentUser().signOut();
	clearAWSCredentialCache();
}
