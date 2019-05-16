exports.Teacher = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
			format: 'int64',
		},
		authIdToken: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		email: {
			type: 'string',
			format: 'email',
		},
		phoneNum: {
			type: 'string',
		},
	},
	additionalProperties: false,
	// if ID is required, it should be excplicitly stated when included.
	required: ['authIdToken', 'name', 'email'],
};

exports.Student = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
			format: 'int64',
		},
		authIdToken: {
			type: 'string',
		},
		name: {
			type: 'string',
		},
		email: {
			type: 'string',
			format: 'email',
		},
		phoneNum: {
			type: 'string',
		},
	},
	additionalProperties: false,
	// if ID is required, it should be excplicitly stated when included.
	required: ['authIdToken', 'name', 'email'],
};

exports.Course = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
			format: 'int64',
		},
		name: {
			type: 'string',
		},
		teacherId: {
			type: 'integer',
			format: 'int64',
		},
		location: {
			type: 'string',
		},
		description: {
			type: 'string',
		},
		startDate: {
			type: 'string',
			format: 'date',
		},
		endDate: {
			type: 'string',
			format: 'date',
		},
	},
	additionalProperties: false,
	// if ID is required, it should be excplicitly stated when included.
	required: ['teacherId', 'name', 'startDate', 'endDate'],
};

exports.Log = {
	oneOf: [{
		type: 'object',
		properties: {
			id: {
				type: 'integer',
				format: 'int64',
			},
			studentId: {
				type: 'integer',
				format: 'int64',
			},
			courseId: {
				type: 'integer',
				format: 'int64',
			},
			messageType: {
				type: 'string',
				enum: [
					'EMON',
				],
			},
			time: {
				type: 'string',
				format: 'date-time',
			},
			messageReason: {
				type: 'string',
				description: 'unused currently. used to point out the reason for awarding money.',
			},
			value: {
				type: 'integer',
				format: 'int64',
				description: 'The amount of emon given.',
			},
		},
	},
	{
		type: 'object',
		properties: {
			id: {
				type: 'integer',
				format: 'int64',
			},
			studentId: {
				type: 'integer',
				format: 'int64',
			},
			courseId: {
				type: 'integer',
				format: 'int64',
			},
			messageType: {
				type: 'string',
				enum: [
					'EMOJI',
				],
			},
			time: {
				type: 'string',
				format: 'date-time',
			},
			emojiType: {
				type: 'string',
				description: 'what emoji was sent',
				enum: [
					'EMOJI_HAPPY',
					'EMOJI_THUMBS_UP',
					'EMOJI_ANGEL',
					'EMOJI_GRIN',
					'EMOJI_SHUSH',
					'EMOJI_ZZZ',
					'EMOJI_ANGRY',
					'EMOJI_THUMBS_DOWN',
				],
			},
		},
	},
	],
};

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
				format: 'int64',
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
