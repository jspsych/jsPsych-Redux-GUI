const AWS = require('aws-sdk'),
	  https = require('https'),
	  User_Table_Name = "jsPsych_Builder_Users";

function postDataToOSF(
	token,
	data,
	parentNodeId,
	lambdaContext
) {

	var body = JSON.stringify({
			"data": {
				"type": "nodes",
				"attributes": {
					"title": "Test POST",
					"category": "data",
					"public": true,
					"description": data,
				}
			}
		}),
		postOptions = {
			hostname: "api.osf.io",
			path: `/v2/nodes/${parentNodeId}/children/`,
			method: "POST",
			headers: {
				"Content-Type": "application/vnd.api+json",
				"Content-Length": Buffer.byteLength(body),
				"Authorization": `Bearer ${token}`
			}
		};

	const req = https.request(postOptions, (res) => {
		lambdaContext.succeed(res.statusCode);
	})

	req.on('error', (e) => {
		lambdaContext.fail(e);
	});

	req.write(body);
	req.end();
}



function connectDynamoDB() {
	return new(AWS.DynamoDB.DocumentClient)({
		apiVersion: '2012-08-10',
	});
}

function getItem(param) {
	return connectDynamoDB().get(param).promise();
}

function getUserData(id) {
	let param = {
		TableName: User_Table_Name,
		Key: {
			'userId': id
		}
	};
	return getItem(param);
}

exports.handler = (event, context, callback) => {
	let {
		// experiment creator id (jspsych builder side)
		userId,
		// osf parent node id
		osfFolderId,
		// should be string
		experimentData
	} = event;

	getUserData(userId).then((data) => {
		if (!data) {
			throw `Invalid account id ${userId}`;
		} else {
			let osfToken = data.Item.fetch.osfToken;

			if (!osfToken) {
				throw new Error("OSF Token is not set for this account.");
			}

			postDataToOSF(osfToken, experimentData, osfFolderId, context);
		}
	}).catch((err) => {
		context.fail(err);
	})

};