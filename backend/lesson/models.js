exports.Message = {
	oneOf: [{
		type: 'object',
		properties: {
			messageType: {
				type: 'string',
				enum: ['EMON'],
			},
			messageReason: {
				type: 'string',
			},
			value: {
				type: 'integer',
			},
		},
		required: ['messageType', 'value'],
	},
	{
		type: 'object',
		properties: {
			messageType: {
				type: 'string',
				enum: ['EMOJI'],
			},
			emojiType: {
				type: 'string',
				enum: ['EMOJI_HAPPY', 'EMOJI_THUMBS_UP', 'EMOJI_ANGEL', 'EMOJI_GRIN', 'EMOJI_SHUSH', 'EMOJI_ZZZ', 'EMOJI_ANGRY', 'EMOJI_THUMBS_DOWN'],
			},
		},
		required: ['messageType', 'emojiType'],
	},
	],
};

exports.TeacherMessage = {
	oneOf: [{
		type: 'object',
		properties: {
			studentId: {
				type: 'string',
			},
			messageType: {
				type: 'string',
				enum: ['MESSAGE'],
			},
			content: {
				type: 'string',
				enum: ['MESSAGE_CONFUSED', 'MESSAGE_QUESTION', 'MESSAGE_NEED_TO_LEAVE', 'MESSAGE_ANSWER', 'MESSAGE_LOUDER'],
			},
		},
		required: ['studentId', 'messageType', 'content'],
	},
	{
		type: 'object',
		properties: {
			messageType: {
				type: 'string',
				enum: ['EMOJI'],
			},
			emojiType: {
				type: 'string',
				enum: ['EMOJI_HAPPY', 'EMOJI_THUMBS_UP', 'EMOJI_ANGEL', 'EMOJI_GRIN', 'EMOJI_SHUSH', 'EMOJI_ZZZ', 'EMOJI_ANGRY', 'EMOJI_THUMBS_DOWN'],
			},
		},
		required: ['messageType', 'emojiType'],
	},
	],
};
