var dbUtils = require('./dbUtils.js');
var TYPES = dbUtils.TYPES;

var column = cols => {
    return {
        name: cols[1].value,
        position: cols[2].value,
        dataType: cols[3].value,
        nullable: cols[4].value,
        maxLength: cols[5].value,
        octetLength: cols[6].value,
        precision: cols[7].value,
        scale: cols[8].value
    };
};

var columns = dbColumns => { return dbColumns.map(column); };

var fullTable = rows => {
    return {
        name: rows[0][0].value,
        columns: columns(rows)
    }
};

var emptyTable = cols => {
    return {
        name: cols[0].value,
        columns: []
    }
};
const emptyTables = dbRows => { return dbRows.map(emptyTable); };


/**
 * @param {config} config - The connection config.
 * @param {string} config.database - The name of the database to connect to.
 */
module.exports.names = function (config) {
    var resultMessage = {
        success: false,
        message: '',
        tables: []
    };

    var sql = ` select table_name
              from	 information_schema.tables(nolock)
              where	  table_type='BASE TABLE'`;

   

    return new Promise((res, rej) => {
         var rows = [];

        dbUtils.executeSql(config, {
            sql: sql
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.tables = emptyTables(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};

module.exports.table = function (config, tableName) {

    var resultMessage = {
        success: false,
        message: '',
        function: null
    };

    var sql = `select table_name name,
                    column_name,
                    ordinal_position,
                    data_type,
                    is_nullable,
                    character_maximum_length,
                    character_octet_length,
                    numeric_precision,
                    numeric_scale
              from	information_schema.columns (nolock)
              where table_name=@table_name`;


    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql,
            parms: [
                { name: 'table_name', type: TYPES.VarChar, value: tableName }
            ]
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.table = fullTable(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};







