import { cognitoConfig } from '../../../../config/aws-config-cognito';

var AWS = require('aws-sdk');
AWS.config.region = cognitoConfig.region;
AWS.config.setPromisesDependency(Promise);

export default AWS;
