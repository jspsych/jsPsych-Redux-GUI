import { cognitoConfig } from '../../../../config/aws-config-cognito.js';

var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;

var dynamodb = new AWS.DynamoDB({
	apiVersion: '2012-08-10',
	region: cognitoConfig.region,
	accessKeyId: window.sessionStorage.accessKeyId,
	secretAccessKey: window.sessionStorage.secretAccessKey,
	sessionToken: window.sessionStorage.sessionToken,
});