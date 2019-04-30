'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;
const iot = require('./Notifications')

function dbRowToProperObject(obj) {
	delete obj.studentId;
	delete obj.courseId;
	delete obj.idToken;
	delete obj.dtime;
	switch(obj.msgType)
	{
		case 0:
			delete obj.msgType;
			obj.messageType = "EMON";
			obj.messageReason = "" + obj.msgReason;
			delete obj.msgReason;
			obj.value = obj.val;
			delete obj.val;
			delete obj.live;

			break;
		case 1:
			delete obj.msgType;
			obj.messageType = "EMOJI";
			delete obj.msgReason;
			delete obj.live;
			switch (obj.val) {
				case 0:
					obj.emojiType = 'EMOJI_HAPPY'
					break;
				case 1:
					obj.emojiType = 'EMOJI_THUMBS_UP'
					break;
				case 2:
					obj.emojiType = 'EMOJI_ANGEL'
					break;
				case 3:
					obj.emojiType = 'EMOJI_GRIN'
					break;
				case 4:
					obj.emojiType = 'EMOJI_SHUSH'
					break;
				case 5:
					obj.emojiType = 'EMOJI_ZZZ'
					break;
				case 6:
					obj.emojiType = 'EMOJI_ANGRY'
					break;
				case 7:
					obj.emojiType = 'EMOJI_THUMBS_DOWN'
					break;
			}
			delete obj.val;
			break;
	}
	return obj
}

function objToDBRow(obj, courseId, studentId) {
	var nobj = Object.assign({}, obj);
	nobj.courseId = courseId;
	nobj.studentId = studentId;
	nobj.dtime = new Date(Date.now()).toISOString();
	nobj.live = true;
	switch (nobj.messageType) {
		case 'EMON':
			nobj.msgType = 0;
			if("messageReason" in nobj)
			{
				//currently unused
				delete nobj.messageReason;
			}
			nobj.val = nobj.value;
			delete nobj.value;

			break;
		case 'EMOJI':
			nobj.msgType = 1;

			switch (nobj.emojiType) {
				case 'EMOJI_HAPPY':
					nobj.val = 0;
					break;
				case 'EMOJI_THUMBS_UP':
					nobj.val = 1;
					break;
				case 'EMOJI_ANGEL':
					nobj.val = 2;
					break;
				case 'EMOJI_GRIN':
					nobj.val = 3;
					break;
				case 'EMOJI_SHUSH':
					nobj.val = 4;
					break;
				case 'EMOJI_ZZZ':
					nobj.val = 5;
					break;
				case 'EMOJI_ANGRY':
					nobj.val = 6;
					break;
				case 'EMOJI_THUMBS_DOWN':
					nobj.val = 7;
					break;
				default:

			}
			delete nobj.emojiType;
			break;
	}
	delete nobj.messageType;
	return nobj;
}

// GET lesson/{courseId}/messages/{studentId}
module.exports.get = (event, context, callback) => {
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.courseId) || !(event.pathParameters.studentId)) {
        callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid Input, please send us the course's ID and the student's ID!",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.courseId) || isNaN(event.pathParameters.studentId)) {
		//then the ID is invalid
		callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid ID! It should be an integer.",
            })
        });
        return;
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Logs').where({
            courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
			live: true
        }).select()
		.then((result) => {
            knex.client.destroy();

			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: JSON.stringify(result.map(dbRowToProperObject))
			});

        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};


// POST lesson/{courseId}/messages/{studentId}
module.exports.post = (event, context, callback) => {
	//context.callbackWaitsForEmptyEventLoop = false
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.courseId) || !(event.pathParameters.studentId)) {
        callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid Input, please send us the course's ID and the student's ID!",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.courseId) || isNaN(event.pathParameters.studentId)) {
		//then the ID is invalid
		callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid ID! It should be an integer.",
            })
        });
        return;
	}

	var messageObj;
	try {
		messageObj = JSON.parse(event.body);
	} catch (e) {
		callback(null, {
            statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid JSON. Error: " + e.message,
            })
        });
        return;
	}


	var validateRes = validate(messageObj, models.Message);
	if(!validateRes.valid) {
		callback(null, {
            statusCode: 405,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid JSON object. Errors: " + JSON.stringify(validateRes.errors),
            })
        });
        return;
	}

	var objToInsert = objToDBRow(messageObj, event.pathParameters.courseId, event.pathParameters.studentId)

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Logs')
		.insert(objToInsert)
		.then(async (result) => {
            knex.client.destroy();
			iot.connect().then(() => {
				iot.client.publish('lesson/' + event.pathParameters.courseId + '/messages/' + event.pathParameters.studentId , JSON.stringify(messageObj), {}, (uneededResult) => {
					iot.client.end(false)
					callback(null, {
						statusCode: 200,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Credentials': true
						},
						body: ""
					});
					return;
				})
			});
        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};


// DELETE lesson/{courseId}/messages/{studentId}
module.exports.delete = (event, context, callback) => {
	//context.callbackWaitsForEmptyEventLoop = false
	if (!("pathParameters" in event) || !(event.pathParameters) || !(event.pathParameters.courseId) || !(event.pathParameters.studentId)) {
        callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid Input, please send us the course's ID and the student's ID!",
            })
        });
        return;
    }
	else if (isNaN(event.pathParameters.courseId) || isNaN(event.pathParameters.studentId)) {
		//then the ID is invalid
		callback(null, {
            statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
            body: JSON.stringify({
                message: "Invalid ID! It should be an integer.",
            })
        });
        return;
	}

    // Connect
    const knex = require('knex')(dbConfig);

    knex('Logs')
		.where({
			courseId: event.pathParameters.courseId,
			studentId: event.pathParameters.studentId,
			live: true
		})
		.update({live: false})
		.then(async (result) => {
            knex.client.destroy();
			callback(null, {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true
				},
				body: ""
			});
			return;
        })
        .catch((err) => {
            console.log('error occurred: ', err);
            // Disconnect
            knex.client.destroy();
            callback(err);
        });
};
