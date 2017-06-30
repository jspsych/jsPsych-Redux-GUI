import { cognitoConfig } from '../../../../config/aws-config-cognito';

var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;
if (typeof Promise === 'undefined') {
	AWS.config.setPromisesDependency(require('bluebird'));
} else {
	AWS.config.setPromisesDependency(Promise);
}

export default AWS;
