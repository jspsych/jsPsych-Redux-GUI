import { cognitoConfig } from '../../../../config/aws-config-cognito';

var AWS = require('aws-sdk/global');
require('aws-sdk/clients/s3');
require('aws-sdk/clients/dynamodb');
AWS.config.region = cognitoConfig.region;
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

module.exports = AWS;
