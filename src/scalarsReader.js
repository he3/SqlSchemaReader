var dbUtils = require('./dbUtils');
var TYPES = dbUtils.TYPES;

var areturn = cols => {
    return {
        dataType: cols[4].value,
        maxLength: cols[5].value,
        octetLength: cols[6].value,
        precision: cols[7].value,
        scale: cols[8].value
    };
};

var parm = cols => {
    return {
        name: cols[1].value.replace('@', ''),
        position: cols[2].value,
        dataType: cols[4].value,
        maxLength: cols[5].value,
        octetLength: cols[6].value,
        precision: cols[7].value,
        scale: cols[8].value
    };
};

var validFunctionName = cols => cols[0].value;
var validReturn = cols => cols[3].value === 'OUT';
var validParam = cols => cols[3].value === 'IN';

var returns = dbReturns => {
    const validReturns = dbReturns.filter(validReturn);
    return validReturns.map(areturn);
};

var parms = dbParms => {
    const validParms = dbParms.filter(validParam);
    return validParms.map(parm);
};

var fullScalar = rows => {
    return {
        name: rows[0][0].value,
        returns: returns(rows),
        parms: parms(rows)
    }
};

var emptyScalar = cols => {
    return {
        name: cols[0].value,
        returns: [],
        parms: []
    }
};

var emptyScalars = dbScalars => {
    const validScalars = dbScalars.filter(validFunctionName);
    return validScalars.map(emptyScalar);
};


module.exports.names = function (config) {
    var resultMessage = {
        success: false,
        message: '',
        scalars: []
    };

    var sql = ` select r.routine_name
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='function'
                      and r.data_type!='table'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.scalars = emptyScalars(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};

module.exports.scalar = function (config, functionName) {

    var resultMessage = {
        success: false,
        message: '',
        scalar: null
    };

    var sql = `select p.specific_name,
                    p.parameter_name,
                    p.ordinal_position,
                    p.parameter_mode,
                    p.data_type,
                    p.character_maximum_length,
                    p.character_octet_length,
                    p.numeric_precision,
                    p.numeric_scale
              from	information_schema.routines(nolock) r
                    left join information_schema.parameters(nolock) p
                      on r.routine_name=p.specific_name
              where	r.routine_type='function'
                    and r.data_type!='table'
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
                resultMessage.scalar = fullScalar(rows);
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

