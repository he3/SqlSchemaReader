var tedious = require('tedious');
var Connection = tedious.Connection;
var Request = tedious.Request;
var TYPES = require('tedious').TYPES;


exports.TYPES = TYPES;

exports.executeSql = function (request, rowCallback, requestCallback, errorCallback) {

	var config = {
		userName: request.username,
		password: request.password,
		server: request.server,
		options: {
			database: request.database,
			connectTimeout: 30*1000,
			requestTimeout: 30*1000
		}
		// If you're on Windows Azure, you will need this:
		//options: {encrypt: true}
	};

	var connection = new Connection(config);

	connection.on('connect', function (err) {
		if (err) {
			errorCallback(err.name + ': ' + err.message + '\r\n[' + err.code + ']');
			console.error('Connect Failed. Error:', err);
			return;
		}

		var req = new Request(request.sql, function (err, rowCount) {
			if (err) {
				errorCallback(err);
				console.log('Request Failed:' + err);
			} else {
				requestCallback(rowCount);
			}
			connection.close();
		});

		if(request.parms){
			R.forEach(p=>{
				req.addParameter(p.name, p.type, p.value);
			}, request.parms);
		}

		req.on('row', function (columns) {
			rowCallback(columns);
		});

		connection.execSql(req);
	});
};