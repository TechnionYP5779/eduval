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
	const email = `${username}@fake.email`;
	const password = passwordGenerator.generate({
		length: 10,
		excludeSimilarCharacters: true,
		numbers: true,
		strict: true,
		uppercase: true,
		symbols: true,
	});
	let auth0Token = null;
	let idToken = null;
	let studentId = null;
	let courseId = null;
	let decodedToken = null;
	let accessToken = null;

	return management.createUser({
		email,
		password,
		name: event.body.nickname,
		username,
		nickname: event.body.nickname,
		connection: 'Username-Password-Authentication',
	})
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

			idToken = Buffer.from(decodedToken.sub).toString('base64');
			auth0Token = response.id_token;
			return Promise.resolve();
		})
		.then(() => axios.post('https://api.emon-teach.com/student', {
			authIdToken: idToken,
			name: event.body.nickname,
			email,
			phoneNum: '000-0000000',
		}, {
			headers: {
				Authorization: `Bearer ${auth0Token}`,
			},
		}))
		.then((response) => {
			// Not sure if already int or not. If yes, this does nothing.
			studentId = parseInt(response.data, 10);
		})
		.then(() =>	knexConnection('DemoHashes')
			.where({
				demoId: event.pathParameters.demoHash,
			}))
		.then((result) => {
			knexConnection.client.destroy();

			// eslint-disable-next-line prefer-destructuring
			courseId = result[0].courseId;

			if (result.length === 1) {
				return axios({
					url: `https://api.emon-teach.com/course/${courseId}/registered`,
					method: 'post',
					data: [parseInt(studentId, 10)],
					headers: {
						Authorization: `Bearer ${auth0Token}`,
					},
				});
				// return axios.post(`https://api.emon-teach.com/course/${courseId}/registered`, `[${studentId}]`, {
				// 	headers: {
				// 		Authorization: `Bearer ${auth0Token}`,
				// 	},
				// });
			}
			if (result.length === 0) {
				callback(createError.NotFound('Demo lesson not found.'));
				return Promise.reject(createError.NotFound('Demo lesson not found.'));
			}

			callback(createError.InternalServerError('More than one demo lesson with this hash.'));
			return Promise.reject(createError.InternalServerError('More than one demo lesson with this hash.'));
		})
		// TODO: start lesson? join lesson
		.then(() => axios.post(`https://api.emon-teach.com/lesson/${courseId}/status`, 'LESSON_START', {
			headers: {
				Authorization: `Bearer ${auth0Token}`,
			},
		}))
		.then(() => axios.post(`https://api.emon-teach.com/lesson/${courseId}/present`, {
			id: studentId,
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
