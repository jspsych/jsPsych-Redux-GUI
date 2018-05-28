import { cognitoConfig } from '../../../../config/aws-config-cognito';
import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: cognitoConfig.IdentityPoolId,
        region: cognitoConfig.region,
        userPoolId: cognitoConfig.UserPoolId,
        userPoolWebClientId: cognitoConfig.ClientId,
    }
}); 


export const signIn = ({username, password}) => {
	return Auth.signIn(username, password).then(user => user);
}

export const signUp = ({username, password, attributes={}, validationData=[]}) => {
	return Auth.signUp({
        username: username,
        password: password,
        attributes: attributes,
        validationData: validationData
    }).then(data => data);
}

export const signOut = () => {
	return Auth.signOut().then(data => data);
}

export const forgetPassword = ({username}) => {
	return Auth.forgetPassword(username).then(data => data);
} 

export const forgetPasswordSubmit = ({username, code, new_password}) => {
	return Auth.forgotPasswordSubmit(username, code, new_password).then(data => data);
}

export const currentSession = () => {
	return Auth.currentSession();
}

export const currentUserCredential = () => {
	return Auth.currentUserCredentials();
}

export const currentAuthenticatedUser = () => {
	return Auth.currentAuthenticatedUser();
}

export const resendVerification = ({username}) => {
	return Auth.resendSignUp(username)
}

export const confirmSignUp = ({username, code}) => {
	return Auth.confirmSignUp(username, code)
}