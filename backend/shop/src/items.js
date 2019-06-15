const knex = require('knex');
const middy = require('middy');
const {
	cors, httpEventNormalizer, httpErrorHandler, jsonBodyParser, validator,
} = require('middy/middlewares');
const createError = require('http-errors');
const dbConfig = require('../db');
const corsConfig = require('../cors');
const models = require('../models');

function dbRowToProperObject(obj) {
	const retObj = { ...obj };		// shallow copy
	retObj.id = obj.itemId;
	delete retObj.itemId;
	delete retObj.courseId;
	delete retObj.active;
	return retObj;
}

function objectToDdRow(obj) {
	const retObj = { ...obj };		// shallow copy
	if ('id' in obj) {
		retObj.itemId = obj.id;
		delete retObj.id;
	}
	delete retObj.courseId;
	return retObj;
}

function isAnInteger(obj) {
	return !Number.isNaN(Number(obj)) && Number.isInteger(Number(obj));
}

// GET shop/{courseId}/items
const getShopItems = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('ShopItems')
		.where({
			courseId: event.pathParameters.courseId,
			active: true,
		})
		.select()
		.then((result) => {
			knexConnection.client.destroy();

			callback(null, {
				statusCode: 200,
				body: JSON.stringify(result.map(dbRowToProperObject)),
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR getting shop items: ${err}`);
			return callback(createError.InternalServerError('Error getting shop items.'));
		});
};


// POST shop/{courseId}/items
const addShopItem = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// convert to format stored in DB, and discard ID
	const itemObj = objectToDdRow(event.body);
	if ('itemId' in itemObj) {
		delete itemObj.itemId;
	}
	itemObj.courseId = event.pathParameters.courseId;

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('ShopItems')
		.insert(itemObj)
		.then((result) => {
			knexConnection.client.destroy();
			callback(null, {
				statusCode: 200,
			});
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR adding shop item: ${err}`);
			return callback(createError.InternalServerError('Error adding shop item.'));
		});
};

// PUT shop/{courseId}/items
const updateShopItem = async (event, context, callback) => {
	if (!event.pathParameters.courseId) {
		return callback(createError.BadRequest("Course's ID required."));
	}
	if (!isAnInteger(event.pathParameters.courseId)) {
		return callback(createError.BadRequest('ID should be an integer.'));
	}

	// convert to format stored in DB
	const itemObj = objectToDdRow(event.body);
	itemObj.courseId = event.pathParameters.courseId;

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('ShopItems')
		.where({
			itemId: itemObj.itemId,
		})
		.update(itemObj)
		.then((result) => {
			knexConnection.client.destroy();
			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else if (result === 0) {
				callback(createError.NotFound('Item not found.'));
			} else {
				callback(createError.InternalServerError('More than one item updated.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating shop item: ${err}`);
			return callback(createError.InternalServerError('Error updating shop item.'));
		});
};


// DELETE shop/{courseId}/item/{itemId}
const deleteShopItem = async (event, context, callback) => {
	if (!event.pathParameters.courseId || !event.pathParameters.itemId) {
		return callback(createError.BadRequest("Course's and item's IDs required."));
	}
	if (!isAnInteger(event.pathParameters.courseId) || !isAnInteger(event.pathParameters.itemId)) {
		return callback(createError.BadRequest('IDs should be integers.'));
	}

	// Connect
	const knexConnection = knex(dbConfig);

	return knexConnection('ShopItems')
		.where({
			itemId: event.pathParameters.itemId,
			courseId: event.pathParameters.courseId,
		})
		.update({
			active: false,
		})
		.then((result) => {
			knexConnection.client.destroy();
			if (result === 1) {
				callback(null, {
					statusCode: 200,
					body: '',
				});
			} else if (result === 0) {
				callback(createError.NotFound('Item not found.'));
			} else {
				callback(createError.InternalServerError('More than one item updated.'));
			}
		})
		.catch((err) => {
			// Disconnect
			knexConnection.client.destroy();
			// eslint-disable-next-line no-console
			console.log(`ERROR updating shop item: ${err}`);
			return callback(createError.InternalServerError('Error updating shop item.'));
		});
};

const get = middy(getShopItems)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

const schema = models.ShopItem;
schema.required = ['name', 'cost', 'amountAvailable', 'sellByDate'];

const post = middy(addShopItem)
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

schema.required = ['id'];

const put = middy(updateShopItem)
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

const del = middy(deleteShopItem)
	.use(httpEventNormalizer())
	.use(httpErrorHandler())
	.use(cors(corsConfig));

module.exports = {
	get, post, put, del,
};
