/**
 * @file This file defines the wrapped methods of AWS-Amplify AuthClass.
*/

import { Cognito_Config } from './aws-cognito-config.js';
import { AWS } from './index.js';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
        ...Cognito_Config
    }
}); 

/**
* Wrapped Auth.signIn function
* @param {string} username - username
* @param {string} password - password
* @return {Promise} - A promise that resolves to current user info if successful
*/
export const signIn = ({username, password}) => {
	return Auth.signIn(username, password).then(myaws.Auth.setCredentials).then(myaws.Auth.getCurrentUserInfo);
}

/**
* Wrapped Auth.essentailCredential function that also sets credentials of the AWS sdk object
* @return {Promise} - A promise that resolves to signed in user's credential
*/
export const setCredentials = () => {
	return Auth.currentCredentials().then(credentials => {
		let essentialCredentials = Auth.essentialCredentials(credentials);
		AWS.config.credentials = essentialCredentials;
		
		return essentialCredentials;
	}).catch(err => {
		// not signed in
		if (err.code === 'NotAuthorizedException') {
			console.log(err.message);
			return Promise.resolve(null);
		}
		throw err;
	});
}

/**
* Wrapped Auth.signUp function
* @param {string} username - username
* @param {string} password - password
* @param {Object} attributes - user attributes
* @param {Array} validationData - user's validation data
* @return {Promise} - A promise that resolves if success
*/
export const signUp = ({username, password, attributes={}, validationData=[]}) => {
	return Auth.signUp({
        username: username,
        password: password,
        attributes: attributes,
        validationData: validationData
    });
}

/**
* Wrapped Auth.signOut function
* @return {Promise} - A promise that resolves if success
*/
export const signOut = () => {
	return Auth.signOut();
}

/**
* Wrapped Auth.forgotPassword function
* @param {string} username - username
* @return {Promise} - A promise that resolves if success
*/
export const forgotPassword = ({username}) => {
	return Auth.forgotPassword(username);
} 

/**
* Wrapped Auth.forgotPasswordSubmit function
* @param {string} username - username
* @param {string} code - verification code
* @param {string} new_password - new password
* @return {Promise} - A promise that resolves if success
*/
export const forgotPasswordSubmit = ({username, code, new_password}) => {
	return Auth.forgotPasswordSubmit(username, code, new_password);
}

/**
* Wrapped Auth.resendSignUp function
* @param {string} username - username
* @return {Promise} - A promise that resolves if success
*/
export const resendVerification = ({username}) => {
	return Auth.resendSignUp(username)
}

/**
* Wrapped Auth.confirmSignUp function
* @param {string} username - username
* @param {string} code - verification code
* @return {Promise} - A promise that resolves if success
*/
export const confirmSignUp = ({username, code}) => {
	return Auth.confirmSignUp(username, code)
}

/**
* Wrapped Auth.currentUserInfo function
* @return {Promise} - A promise that resolves to an object that contains successfully signed in user's info
*/
export const getCurrentUserInfo = () => {
	return Auth.currentUserInfo().then(info => {
		if (info === null) {
			return null;
		}
		return {
			userId: info.id,
			username: info.username,
			verified: info.attributes.email_verified,
			email: info.attributes.email
		}
	});
}