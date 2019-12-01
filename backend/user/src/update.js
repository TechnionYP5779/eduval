const middy = require('middy');
const {
	cors, jsonBodyParser, validator, httpErrorHandler,
} = require('middy/middlewares');
const createError = require('http-errors');
const auth0 = require('auth0');
const jwt = require('jsonwebtoken');
const corsConfig = require('../cors');
const models = require('../models');

function objectToUserInfo(obj) {
	const retObj = {};

	if ('firstName' in obj) {
		retObj.user_metadata = {
			first_name: obj.firstName,
		};
		retObj.given_name = obj.firstName;
	}

	if ('lastName' in obj) {
		let tmp = {};
		if ('user_metadata' in retObj) {
			tmp = retObj.user_metadata;
		}
		tmp.last_name = obj.lastName;
		retObj.user_metadata = tmp;
		retObj.family_name = obj.lastName;
	}

	if ('phoneNum' in obj) {
		let tmp = {};
		if ('user_metadata' in retObj) {
			tmp = retObj.user_metadata;
		}
		tmp.phone_number = obj.phoneNum;
		retObj.user_metadata = tmp;
	}

	if ('email' in obj) {
		retObj.email = obj.email;
	}

	if ('username' in obj) {
		retObj.username = obj.username;
	}

	return retObj;
}

class NoPasswordAfterDemoError extends Error {
	constructor(message) {
		super(message); // (1)
		this.name = 'NoPasswordAfterDemoError'; // (2)
		this.statusCode = 998;
	}
}

class NoPasswordError extends Error {
	constructor(message) {
		super(message); // (1)
		this.name = 'NoPasswordError'; // (2)
		this.statusCode = 999;
	}
}

// PUT user/{userId}
const updateUser = async (event, context, callback) => {
	if (!event.pathParameters.userId) {
		return callback(createError.BadRequest("User's ID required."));
	}

	const decodedToken = jwt.decode(event.headers.Authorization.split(' ')[1]);
	const userId = decodeURI(event.pathParameters.userId);

	if (decodedToken.sub !== userId) {
		return callback(createError.Unauthorized("You can't edit a different user!"));
	}

	// convert to format stored in DB, and discard ID
	const userinfo = objectToUserInfo(event.body);

	const management = new auth0.ManagementClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
		clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
		scope: 'read:users',
	});

	const authentication = new auth0.AuthenticationClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
	});

	let username;

	return management.getUser({ id: userId })
		.then((profile) => {
			// eslint-disable-next-line prefer-destructuring
			username = profile.username;
			if ('demo_student' in profile.app_metadata && profile.app_metadata.demo_student === true) {
				if (!('newPassword' in event.body)) {
					throw new NoPasswordAfterDemoError();
				} else {
					return management.updateUser({ id: userId }, {
						app_metadata: {
							demo_student: null,
						},
					});
				}
			}

			if (!('oldPassword' in event.body)) {
				throw new NoPasswordError();
			}

			return authentication.passwordGrant({
				username,
				password: event.body.oldPassword,
				realm: 'Username-Password-Authentication',
			});
		})
		.then(() => management.updateUser({ id: userId }, userinfo))
		.then(() => {
			if ('newPassword' in event.body) {
				return management.updateUser({ id: userId }, { password: event.body.newPassword });
			}
			return Promise.resolve();
		})
		.then(() => {
			callback(null, {
				statusCode: 200,
				body: '',
			});
		})
		.catch((err) => {
			if ('statusCode' in err) {
				if (err.statusCode === 404) {
					return callback(null, {
						statusCode: 404,	// not found
						body: 'No user found with this ID.',
					});
				}
				if (err.statusCode === 400) {
					return callback(null, {
						statusCode: 400,	// bad request
						body: 'Bad user ID.',
					});
				}
				if (err.statusCode === 403) {
					return callback(null, {
						statusCode: 403,	// unauthorized
						body: 'Incorrect password.',
					});
				}
				if (err.statusCode === 429) {
					return callback(null, {
						statusCode: 429,	// too many requests
						body: 'Too many requests. Account has been blocked. We\'ve sent you an email with instructions on how to unblock it.',
					});
				}
				if (err.statusCode === 999) {
					return callback(null, {
						statusCode: 400,	// bad request
						body: 'Missing old password.',
					});
				}
				if (err.statusCode === 998) {
					return callback(null, {
						statusCode: 400,	// bad request
						body: 'New password required after demo.',
					});
				}
			}

			// eslint-disable-next-line no-console
			console.log(`ERROR updating course: ${err}`);
			console.log(err);
			console.log(JSON.stringify(err));
			return callback(createError.InternalServerError('Failed to update course.'));
		});
};


const schema = { ...models.UserInfo };

const handler = middy(updateUser)
	.use(jsonBodyParser())
	.use(validator({
		inputSchema: {
			type: 'object',
			properties: {
				body: schema,
			},
		},
	}))
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = { handler };
