const fs = require('fs');
const path = require('path');
const url = require('url');
const dummyjson = require('dummy-json');
const prettyBytes = require('pretty-bytes');
const chalk = require('chalk');

function MockApiMiddleware (route, options) {
	'use strict';

	const logPrefix = '[' + chalk.blue('MockApi') + '] ';
	const settings = Object.assign({
		mockPath: './mocks/',
		jsonContentType: 'application/json;charset=utf-8'
	}, options);

	return {
		route: route, // '/mockapi',
		handle: function (req, res, next) {
			let jsonData;
			let mockUrlPath = url.parse(req.url).pathname;
			let mockJsonPath = path.join(settings.mockPath + mockUrlPath + '.' + req.method + '.json');
			let dirCatchAll = path.join(require('path').dirname(mockJsonPath)  + '/_.' + req.method + '.json');

			function showError (message, errors) {
				// Print the error in the nodejs console
				console.log(logPrefix + chalk.red(message));

				// Print the error to the browser
				// Return a 404 header, and give a body with the information.
				// This might not be something everybody wants, but for now it seems like a good idea.
				res.statusCode = 404;
				res.setHeader('Content-Type', settings.jsonContentType);
				res.end(JSON.stringify({
					'Message': message,
					'Error': errors
				}));

				// Continue
				next();
			}

			// Tries to get a mock template, if it does not exist we check for a catch all template
			// This is usefull when you have something like /users/:id and still want to provide a response
			try {
				jsonData = fs.readFileSync(mockJsonPath, 'utf8');
			} catch (error) {
				try {
					jsonData = fs.readFileSync(dirCatchAll, 'utf8');
				} catch (error2) {
					showError('Could not find: ' + mockJsonPath + ' or ' + dirCatchAll, [error, error2]);
					return;
				}
			}

			// Will try to parse dummyjson, if it's not sucessfull show an error
			// This is most likely a mistake with the file, and has to be fixed.
			try {
				jsonData = JSON.parse(dummyjson.parse(jsonData));
			} catch (error) {
				showError('Could not parse Mock-JSON: ' + mockJsonPath, error);
				return;
			}

			// Log requested url in the nodejs console
			// Will help to see what url's get requested. Might be information overload.
			console.log(logPrefix + 'Serving %s request:', req.method, chalk.green(route + req.url), prettyBytes(Buffer.byteLength(JSON.stringify(jsonData), 'utf8')));

			res.statusCode = 200;
			res.setHeader('Content-Type', settings.jsonContentType);
			res.end(JSON.stringify(jsonData));

			next();
		}
	};
}

module.exports = MockApiMiddleware;
