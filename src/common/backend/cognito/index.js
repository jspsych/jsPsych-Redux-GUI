import { cognitoConfig } from '../../../../config/aws-config-cognito.js';
import {
	CognitoUser,
	CognitoUserPool,
	AuthenticationDetails,
	CognitoUserAttribute
} from 'amazon-cognito-identity-js';
var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});


function clearAWSCredentialCache() {
	AWS.config.credentials.clearCachedId();
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: cognitoConfig.IdentityPoolId,
	});
	updateAWSCredentialLocalSession();
}

function updateAWSCredentialLocalSession() {
	window.sessionStorage.setItem("accessKeyId", AWS.config.credentials.accessKeyId);
	window.sessionStorage.setItem("secretAccessKey", AWS.config.credentials.secretAccessKey);
	window.sessionStorage.setItem("sessionToken", AWS.config.credentials.sessionToken);
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
	cognitoUser.confirmRegistration(code, true, callback);
}

export function resendVerification(username, callback) {
	var cognitoUser = new CognitoUser({
		Username: username,
		Pool: userPool,
	});
	cognitoUser.resendConfirmationCode(callback);
}

const LoginsKey = 'cognito-idp.' + cognitoConfig.region + '.amazonaws.com/' + cognitoConfig.UserPoolId;
export function fetchCredential(cognitoUser = userPool.getCurrentUser(), dispatchAction = () => {}) {
	if (!cognitoUser) return;

	cognitoUser.getSession((err, result) => {
		if (err) {
			console.log(err);
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
					updateAWSCredentialLocalSession();
					dispatchAction();
				}
			});
		}
	});
}

const cogLocalBaseKey = 'CognitoIdentityServiceProvider.' + cognitoConfig.ClientId + '.';
const lastAuthUserKey = cogLocalBaseKey + 'LastAuthUser';
export function getLoginSessionFromLocalStorage() {
	let lastAuthUser = window.localStorage[lastAuthUserKey];
	let accessTokenkey = cogLocalBaseKey + lastAuthUser + '.accessToken'
	let idTokenkey = cogLocalBaseKey + lastAuthUser + '.idToken'
	let refreshTokenkey = cogLocalBaseKey + lastAuthUser + '.refreshToken'

	return {
		accessToken: window.localStorage[accessTokenkey],
		idToken: window.localStorage[idTokenkey],
		refreshToken: window.localStorage[refreshTokenkey],
	}
}


export function getUserInfoFromLocalStorage() {
	return {
		username: window.localStorage[lastAuthUserKey],
		identityId: (AWS.config.credentials) ? AWS.config.credentials.identityId : undefined,
	}
}

export function logout() {
	userPool.getCurrentUser().signOut();
	clearAWSCredentialCache();
}

