const awsIot = require('aws-iot-device-sdk');

function getContent(url) {
	return new Promise((resolve, reject) => {
		const lib = url.startsWith('https') ? require('https') : require('http');
		const request = lib.get(url, (response) => {
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
			}

			const body = [];
			response.on('data', chunk => body.push(chunk));
			response.on('end', () => resolve(body.join('')));
		});
		request.on('error', err => reject(err));
	});
}


module.exports.connect = async () => getContent('https://qh6vsuof2f.execute-api.eu-central-1.amazonaws.com/dev/iot/keys').then((res) => {
	res = JSON.parse(res);
	module.exports.client = awsIot.device({
		region: res.region,
		protocol: 'wss',
		accessKeyId: res.accessKey,
		secretKey: res.secretKey,
		sessionToken: res.sessionToken,
		port: 443,
		host: res.iotEndpoint,
	});
});

// client.on('connect', onConnect);
// client.on('message', onMessage);
// client.on('error', onError);
// client.on('reconnect', onReconnect);
// client.on('offline', onOffline);
// client.on('close', onClose);
