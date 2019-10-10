exports.Course = {
	type: 'object',
	properties: {
		id: {
			type: 'integer',
		},
		name: {
			type: 'string',
		},
		teacherId: {
			type: 'integer',
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
