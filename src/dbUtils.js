var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = require('tedious').TYPES;


exports.TYPES = TYPES;

exports.executeSql = function (config, command, rowCallback, requestCallback, errorCallback) {

	var connection = new Connection({
		userName: config.username,
		password: config.password,
		server: config.server,
		options: {
			database: config.database,
			connectTimeout: 30 * 1000,
			requestTimeout: 30 * 1000
		}
		// If you're on Windows Azure, you will need this:
		//options: {encrypt: true}
	});

	connection.on('connect', function (err) {
		if (err) {
			errorCallback(err.name + ': ' + err.message + '\r\n[' + err.code + ']');
			console.error('Connect Failed. Error:', err);
			return;
		}

		var req = new Request(command.sql, function (err, rowCount) {
			if (err) {
				errorCallback(err);
				console.log('Request Failed:' + err);
			} else {
				requestCallback(rowCount);
			}
			connection.close();
		});

		if (command.parms) {
			command.parms.forEach(p => req.addParameter(p.name, p.type, p.value));
		}

		req.on('row', function (columns) {
			rowCallback(columns);
		});

		connection.execSql(req);
	});
};



exports.executeSqlFmtOnly = function (config, command, columnMetadataCallback, requestCallback, errorCallback) {

	var connection = new Connection({
		userName: config.username,
		password: config.password,
		server: config.server,
		options: {
			database: config.database,
			connectTimeout: 30 * 1000,
			requestTimeout: 30 * 1000
		}
		// If you're on Windows Azure, you will need this:
		//options: {encrypt: true}
	});

	connection.on('connect', function (err) {
		let _rowCount = 0;
		if (err) {
			errorCallback(err.name + ': ' + err.message + '\r\n[' + err.code + ']');
			console.error('Connect Failed. Error:', err);
			return;
		}

		var req = new Request(
			`SET FMTONLY ON; ${command.sql}; SET FMTONLY OFF;`,
			function (err, rowCount) {
				if (err) {
					errorCallback(err);
					console.log('Request Failed:' + err);
				} else {
					_rowCount = rowCount;
					requestCallback(_rowCount);
				}
				connection.close();
			});

		if (command.parms) {
			command.parms.forEach(p => req.addParameter(p.name, p.type, p.value));
		}

		req.on('columnMetadata', function (columns) {
			columnMetadataCallback(columns);
		});

		connection.execSql(req);
	});
};