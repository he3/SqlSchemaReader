var dbUtils = require('./dbUtils');
var TYPES = dbUtils.TYPES;

var parm = cols => {
    return {
        name: cols[1].value.replace('@', ''),
        position: cols[2].value,
        mode: cols[3].value,
        dataType: cols[4].value,
        maxLength: cols[5].value,
        octetLength: cols[6].value,
        precision: cols[7].value,
        scale: cols[8].value
    };
};

var validProcName = cols => cols[0].value;
var validParam = cols => cols[1].value;

var parms = dbParms => {
    const validParms = dbParms.filter(validParam);
    return validParms.map(parm);
};

var fullProc = rows => {
    return {
        name: rows[0][0].value,
        parms: parms(rows)
    }
};

var emptyProc = cols => {
    return {
        name: cols[0].value,
        parms: []
    }
};

var emptyProcs = dbProcs => {
    const validProcs = dbProcs.filter(validProcName);
    return validProcs.map(emptyProc);
};


module.exports.names = function (config) {
    var resultMessage = {
        success: false,
        message: '',
        procs: []
    };

    var sql = ` select r.routine_name
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='procedure'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.procs = emptyProcs(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};

module.exports.proc = function (config, procName) {

    var resultMessage = {
        success: false,
        message: '',
        proc: null
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
               from	  information_schema.routines(nolock) r
                      left join information_schema.parameters(nolock) p
                        on r.routine_name=p.specific_name
               where	r.routine_type='procedure'
                        and r.routine_name=@routine_name`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(config, {
            sql: sql,
            parms: [
                { name: 'routine_name', type: TYPES.VarChar, value: procName }
            ]
        },
            columns => rows.push(columns),
            rowCount => {
                resultMessage.success = true;
                resultMessage.message = 'Success.';
                resultMessage.proc = fullProc(rows);
                res(resultMessage);
            },
            error => {
                resultMessage.message = error;
                rej(resultMessage);
            });
    });
};



module.exports.definition = function (config, procName) {

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
                { name: 'routine_name', type: TYPES.VarChar, value: procName }
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