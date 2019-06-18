const knex = require('knex');
const middy = require('middy');
const {
	cors, httpEventNormalizer, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const axios = require('axios');
const dbConfig = require('../db');
const corsConfig = require('../cors');

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// POST shop/{courseId}/order
const orderItem = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	const item = await knexConnection('ShopItems')
		.select(['cost', 'amountAvailable'])
		.where({
			itemId: event.body.itemId,
		})
		.then(result => result[0]);

	if (item.amountAvailable < event.body.amount) {
		// Disconnect
		knexConnection.client.destroy();
		return callback(createError.BadRequest('Not enough of this item is available.'));
	}

	const studentMoney = Number.parseInt(axios.get(`${process.env.LAMBDA_ENDPOINT}/student/${event.body.studentId}/emonBalance/byCourse/${event.pathParameters.courseId}`), 10);

	if (item.cost * event.body.amount > studentMoney) {
		// Disconnect
		knexConnection.client.destroy();
		return callback(createError.BadRequest("Student doesn't have enough money."));
	}

	return knexConnection.transaction((trx) => {
		knexConnection('ShopItems')
			.where({
				itemId: event.body.itemId,
			})
			.decrement('amountAvailable', event.body.amount)
			.transacting(trx)
			.then(() => knexConnection('Logs')
				.insert({
					studentId: event.body.studentId,
					courseId: event.pathParameters.courseId,
					dtime: new Date(Date.now()).toISOString(),
					msgType: 0,
					msgReason: event.body.itemId,
					val: event.body.amount * -item.cost,
				})
				.transacting(trx))
			.then(() => knexConnection.raw(
				`${knexConnection('OwnedItems')
					.insert({
						itemId: event.body.itemId,
						studentId: event.body.studentId,
						amount: event.body.amount,
					}).toString()
				} ON DUPLICATE KEY UPDATE amount=amount+${event.body.amount}`
			).transacting(trx))
			.then((result) => {
				trx.commit();

				knexConnection.client.destroy();

				callback(null, {
					statusCode: 200,
					body: '',
				});
			})
			.catch((err) => {
				trx.rollback();
				// Disconnect
				knexConnection.client.destroy();
				// eslint-disable-next-line no-console
				console.log(`ERROR buying item: ${err}`);
				return callback(createError.InternalServerError('Error buying item.'));
			});
	});
};

const schema = {
	type: 'object',
	properties: {
		studentId: {
			type: 'integer',
		},
		itemId: {
			type: 'integer',
		},
		amount: {
			type: 'integer',
		},
	},
	required: ['studentId', 'itemId', 'amount'],
};

const handler = middy(orderItem)
	.use(httpEventNormalizer())
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
