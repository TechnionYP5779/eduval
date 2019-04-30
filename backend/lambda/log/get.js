'use strict';

const dbConfig = require('../db')
const models = require('../models')
const validate = require('jsonschema').validate;

function dbRowToProperObject(obj) {
	obj.time = obj.dtime;
	delete obj.dtime;
	delete obj.live;
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

// GET log/ofStudent/{studentId}/byCourse/{courseId}
module.exports.handler = (event, context, callback) => {
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
			studentId: event.pathParameters.studentId
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
