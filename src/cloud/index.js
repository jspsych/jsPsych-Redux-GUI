import { Cognito_Config } from './aws-cognito-config.js';
import * as auth from './auth.js'
import * as s3 from './s3.js';
import * as dynamodb from './dynamodb.js';


export var AWS = require('aws-sdk/global');
require('aws-sdk/clients/s3');
require('aws-sdk/clients/dynamodb');
AWS.config.region = Cognito_Config.region;
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

export const Auth = auth;
export const S3 = s3;
export const DynamoDB = dynamodb;
