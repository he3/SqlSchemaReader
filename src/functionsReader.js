var dbUtils = require('./dbUtils');
var TYPES = dbUtils.TYPES;

var validFunctionName = cols => cols[0].value;
var validColumn = cols => cols[1].value;
var validParam = cols => cols[2].value;

var column = cols => {
    return {
        name: cols[1].value,
        position: cols[3].value,
        dataType: cols[5].value,
        nullable: cols[6].value,
        maxLength: cols[7].value,
        octetLength: cols[8].value,
        precision: cols[9].value,
        scale: cols[10].value
    };
};

var parm = cols => {
    return {
        name: cols[2].value.replace('@', ''),
        position: cols[3].value,
        mode: cols[4].value,
        dataType: cols[5].value,
        maxLength: cols[7].value,
        octetLength: cols[8].value,
        precision: cols[9].value,
        scale: cols[10].value
    };
};

var columns = dbCols => {
    const validCols = dbCols.filter(validColumn);
    return validCols.map(column);
};

var parms = dbParms => {
    const validParms = dbParms.filter(validParam);
    return validParms.map(parm);
};

var emptyFunction = cols => {
    return {
        name: cols[0].value,
        columns: [],
        parms: []
    }
};

var fullFunction = rows => {
    return {
        name: rows[0][0].value,
        columns: columns(rows),
        parms: parms(rows)
    }
};

var emptyFunctions = dbFuncs => {
    const validFuncs = dbFuncs.filter(validFunctionName);
    return validFuncs.map(emptyFunction);
};


module.exports.names = function (config) {
    var resultMessage = {
        success: false,
        message: '',
        functions: []
    };

    var sql = ` select r.routine_name
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='function'
                      and r.data_type='table'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.functions = emptyFunctions(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};

module.exports.function = function (config, functionName) {

    var resultMessage = {
        success: false,
        message: '',
        function: null
    };

    var sql = `select c.table_name name,
                    c.column_name,
                    null parameter_name,
                    c.ordinal_position,
                    null parameter_mode,
                    c.data_type,
                    c.is_nullable,
                    c.character_maximum_length,
                    c.character_octet_length,
                    c.numeric_precision,
                    c.numeric_scale
              from  information_schema.routines(nolock) r
                      left join information_schema.routine_columns(nolock) c
                        on r.routine_name=c.table_name
              where	r.routine_type='function'
                    and r.data_type='table'
                    and r.routine_name=@routine_name
              union select
                    p.specific_name,
                    null,
                    p.parameter_name,
                    p.ordinal_position,
                    p.parameter_mode,
                    p.data_type,
                    null,
                    p.character_maximum_length,
                    p.character_octet_length,
                    p.numeric_precision,
                    p.numeric_scale
              from	information_schema.routines(nolock) r
                      left join information_schema.parameters(nolock) p
                        on r.routine_name=p.specific_name
              where	r.routine_type='function'
                    and r.data_type='table'
                    and r.routine_name=@routine_name`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql,
            parms: [
                { name: 'routine_name', type: TYPES.VarChar, value: functionName }
            ]
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.function = fullFunction(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};


module.exports.definition = function (config, functionName) {

    var resultMessage = {
        success: false,
        message: '',
        definition: null
    };

    var sql = ` select  sm.definition
              from    sys.sql_modules AS sm
                      join sys.objects AS o 
                        on sm.object_id = o.object_id
              where   o.name = @routine_name`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql,
            parms: [
                { name: 'routine_name', type: TYPES.VarChar, value: functionName }
            ]
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                if (rows[0] && rows[0][0])
                    resultMessage.definition = rows[0][0].value;
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};
