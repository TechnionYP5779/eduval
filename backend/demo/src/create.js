const knex = require('knex');
const middy = require('middy');
const {
	cors, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const uuidv5 = require('uuid/v5');
const axios = require('axios');
const dbConfig = require('../db');
const corsConfig = require('../cors');
const models = require('../models');

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	if ('id' in obj) {
		retObj.courseId = obj.id;
		delete retObj.id;
	}
	retObj.courseName = obj.name;
	delete retObj.name;
	return retObj;
}

// POST demo
const addDemoCourse = async (event, context, callback) => {
	// convert to format stored in DB, and discard ID
	const courseObj = objectToDdRow(event.body);
	if ('courseId' in courseObj) {
		delete courseObj.courseId;
	}

	// Connect
	const knexConnection = knex(dbConfig);
	let demoHash;
	let demoLink;
	let courseId;

	return knexConnection('Courses')
		.select('courseName')
		.where('courseName', 'like', `${courseObj.courseName}%`)
		.andWhere('teacherId', courseObj.teacherId)
		.then((result) => {
			if (result.length !== 0) {
				const highestNumber = result.map((x) => {		// Parse "Lesson #123" => 123
					const hashIndex = x.courseName.lastIndexOf('#');
					if (hashIndex === -1) {
						return 1;
					}
					return parseInt(x.courseName.substr(hashIndex + 1, x.courseName.length), 10);
				}).sort((a, b) => b - a)[0];	// reverse sort and select largest

				courseObj.courseName = `${courseObj.courseName} #${highestNumber + 1}`;
			}
		})
		.then(() =>	knexConnection('Courses')
			.insert(courseObj))
		.then((result) => {
			// eslint-disable-next-line prefer-destructuring
			courseId = result[0];
			demoHash = uuidv5(`https://emon-teach.com/course/${result[0]}`, uuidv5.URL);
			return knexConnection('DemoHashes')
				.insert({
					teacherId: courseObj.teacherId,
					courseId: result[0],
					demoId: demoHash,
				});
		})
		.then(() => axios.post('https://api-ssl.bitly.com/v4/shorten', {
			group_guid: process.env.BITLY_GROUP_GUID,
			long_url: `${process.env.NEW_DEMO_REDIRECT_DOMAIN}/demo-invite?id=${demoHash}`,
		}, {
			headers: { Authorization: `Bearer ${process.env.BITLY_APIKEY}`, 'Content-Type': 'application/json' },
		}))
		.then((response) => {
			demoLink = response.data.link;
			return knexConnection('Courses')
				.update('demoLink', demoLink)
				.where('courseId', courseId);
		})
		.then(() => axios.get(`https://api.emon-teach.com/teacher/${courseObj.teacherId}/activeLesson`, {
			headers: {
				Authorization: event.headers.Authorization,
			},
		}))
		.then(() => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
				body: `${demoLink}`,
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR adding course: ${err}. ${JSON.stringify(err)}`);
			// eslint-disable-next-line no-console
			console.log(err.response.data);
			// console.log(`ERROR adding course: ${err}. ${JSON.stringify(err)}`);
			return callback(createError.InternalServerError('Error adding course.'));
		});
};

const schema = models.Course;

const handler = middy(addDemoCourse)
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
