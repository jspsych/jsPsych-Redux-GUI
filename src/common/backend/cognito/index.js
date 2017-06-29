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

const convertUndefinedString = (s) => (s === 'undefined' ? undefined : s);

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

export function signUp(username, password, attributes, callback) {

	var attributeList = [];
	for (let attribute of attributes) {
		attributeList.push(new CognitoUserAttribute(attribute));
	}

	userPool.signUp(username, password, attributeList, null, callback);
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
export function fetchCredential(cognitoUser = userPool.getCurrentUser(), callback = () => {}) {
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
					callback();
					console.log('Successfully logged!');
				}
			});
		}
	});
}

const cogLocalBaseKey = 'CognitoIdentityServiceProvider.' + cognitoConfig.ClientId + '.';
const identityIdKey = 'aws.cognito.identity-id.' + cognitoConfig.IdentityPoolId;
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
		accessKeyId: convertUndefinedString(window.sessionStorage.accessKeyId),
		secretAccessKey: convertUndefinedString(window.sessionStorage.secretAccessKey),
		sessionToken: convertUndefinedString(window.sessionStorage.sessionToken),
	}
}


export function getUserInfoFromLocalStorage() {
	return {
		username: window.localStorage[lastAuthUserKey],
		identityId: window.localStorage[identityIdKey],
	}
}

export function logout() {
	userPool.getCurrentUser().signOut();
	clearAWSCredentialCache();
}
