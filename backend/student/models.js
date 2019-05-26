exports.Student = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
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
