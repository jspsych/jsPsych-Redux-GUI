/**
 * @file This file defines the wrapped methods of AWS-Amplify AuthClass.
 * @author Junyan Qi <juqi@vassar.edu>
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
* @return {Promise} - A promise that resolves to an object that contains successfully signed in user's info
*/
export const signIn = ({username, password}) => {
	return Auth.signIn(username, password).then(setCredentials).then(getCurrentUserInfo);
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
	});
}

/**
* Wrapped Auth.forgetPasswordSubmit function
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
    }).then(data => data);
}

/**
* Wrapped Auth.signOut function
* @return {Promise} - A promise that resolves if success
*/
export const signOut = () => {
	return Auth.signOut();
}

/**
* Wrapped Auth.forgetPassword function
* @param {string} username - username
* @return {Promise} - A promise that resolves if success
*/
export const forgetPassword = ({username}) => {
	return Auth.forgetPassword(username);
} 

/**
* Wrapped Auth.forgetPasswordSubmit function
* @param {string} username - username
* @param {string} code - verification code
* @param {string} new_password - new password
* @return {Promise} - A promise that resolves if success
*/
export const forgetPasswordSubmit = ({username, code, new_password}) => {
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
			identityId: info.id,
			username: info.username,
			verified: info.attributes.email_verified,
			email: info.attributes.email
		}
	});
}