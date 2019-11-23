const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const axios = require('axios');
const auth0 = require('auth0');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passwordGenerator = require('generate-password');
const dbConfig = require('../db');
const corsConfig = require('../cors');

// POST /demo/students
const registerDemoStudent = async (event, context, callback) => {
	// Connect
	const knexConnection = knex(dbConfig);
	const management = new auth0.ManagementClient({
		domain: 'e-mon.eu.auth0.com',
		clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
		clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
		scope: 'read:users update:users create:users',
	});

	const username = shortid.generate();
	let email;
	let emailSuffix;
	const password = passwordGenerator.generate({
		length: 10,
		excludeSimilarCharacters: true,
		numbers: true,
		strict: true,
		uppercase: true,
		symbols: true,
	});
	// eslint-disable-next-line camelcase
	const [given_name, ...restOfName] = event.body.nickname.split(' ');
	// eslint-disable-next-line camelcase
	const family_name = restOfName.join(' ');
	let auth0Token = null;
	// let idToken = null;
	let courseId = null;
	let decodedToken = null;
	let accessToken = null;

	return knexConnection('DemoHashes')
		.where({
			demoId: event.pathParameters.demoHash,
		})
		.then((result) => {
			// eslint-disable-next-line prefer-destructuring
			courseId = result[0].courseId;
			emailSuffix = `fake${crypto.createHash('md5').update(courseId.toString()).digest('hex')}.email`;
			email = `${username}@${emailSuffix}`;

			if (result.length === 0) {
				callback(createError.NotFound('Demo lesson not found.'));
				return Promise.reject(createError.NotFound('Demo lesson not found.'));
			}
			if (result.length !== 1) {
				callback(createError.InternalServerError('More than one demo lesson with this hash.'));
				return Promise.reject(createError.InternalServerError('More than one demo lesson with this hash.'));
			}

			return knexConnection('PresentStudents')
				.select()
				.where({
					courseId: result[0].courseId,
					desk: event.body.seatNumber,
				});
		})
		.then((result) => {
			if (result.length !== 0) {
				callback(null, {
					statusCode: 409,		// HTTP Gone
					body: JSON.stringify({
						error: 'DESK_TAKEN',
					}),
				});
				return Promise.reject(createError.Conflict('The requested desk is already taken.'));
			}

			return Promise.resolve();
		})
		.then(() => knexConnection('Courses')
			.select('status')
			.where({
				courseId,
			}))
		.then((result) => {
			if (result[0].status === 'LESSON_END') {
				callback(null, {
					statusCode: 409,		// HTTP Gone
					body: JSON.stringify({
						error: 'COURSE_NOT_STARTED',
					}),
				});
				return Promise.reject(createError.Gone('The course is not active.'));
			}

			return Promise.resolve();
		})
		.then(() => management.getUsers({
			search_engine: 'v3',
			q: `email:*@${emailSuffix} AND name:${event.body.nickname}`,
		}))
		.then((users) => {
			if (users.length !== 0) {
				callback(null, {
					statusCode: 409,		// HTTP Gone
					body: JSON.stringify({
						error: 'NAME_TAKEN',
					}),
				});
				return Promise.reject(createError.Gone('This name is already taken.'));
			}

			return Promise.resolve();
		})
		.then(() => management.createUser({
			email,
			password,
			name: event.body.nickname,
			username,
			nickname: event.body.nickname,
			given_name,
			family_name,
			phone_number: '000-0000000',
			connection: 'Username-Password-Authentication',
		}))
		.then(() => {
			const authentication = new auth0.AuthenticationClient({
				domain: 'e-mon.eu.auth0.com',
				clientId: process.env.AUTH0_CLIENT_ID,
				clientSecret: process.env.AUTH0_CLIENT_SECRET,
			});

			return authentication.passwordGrant({
				username,
				password,
				realm: 'Username-Password-Authentication',
			});
		})
		.then((response) => {
			decodedToken = jwt.decode(response.id_token);
			accessToken = response.access_token;

			// idToken = Buffer.from(decodedToken.sub).toString('base64');
			auth0Token = response.id_token;
			return Promise.resolve();
		})
		.then(() => {
			knexConnection.client.destroy();

			return axios({
				url: `https://api.emon-teach.com/course/${courseId}/registered`,
				method: 'post',
				data: [email],
				headers: {
					Authorization: `Bearer ${auth0Token}`,
				},
			});
		})
		.then(() => axios.post(`https://api.emon-teach.com/lesson/${courseId}/present`, {
			id: decodedToken.sub,
			desk: event.body.seatNumber,
		}, {
			headers: {
				Authorization: `Bearer ${auth0Token}`,
			},
		}))
		.then(() => {
			callback(null, {
				statusCode: 200,
				body: JSON.stringify({
					idToken: auth0Token,
					accessToken,
					expiresIn: decodedToken.exp,
					sub: decodedToken.sub,
				}),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR: ${err}. ${JSON.stringify(err)}`);
			// eslint-disable-next-line no-console
			console.log(`RESPONSE: ${err.response}`);
			return callback(createError.InternalServerError('Error joining demo lesson.'));
		});
};

const schema = {
	type: 'object',
	properties: {
		nickname: {
			type: 'string',
		},
		seatNumber: {
			type: 'integer',
		},
	},
	additionalProperties: false,
	required: ['nickname', 'seatNumber'],
};

const handler = middy(registerDemoStudent)
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
