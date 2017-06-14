var utils = require('./utils.js');
var dbUtils = require('./dbUtils');
var TYPES = dbUtils.TYPES;

function dbFunctions(config, functionNames) {
    const sql = `SELECT  
            R.SPECIFIC_SCHEMA,
            R.SPECIFIC_NAME,
            P.ORDINAL_POSITION,
            P.PARAMETER_MODE,
            P.PARAMETER_NAME,
            P.DATA_TYPE,
            ISNULL(P.CHARACTER_MAXIMUM_LENGTH, 0) AS CHARACTER_MAXIMUM_LENGTH,
            cast(ISNULL(P.NUMERIC_PRECISION, 0) as int) AS NUMERIC_PRECISION,
            ISNULL(P.NUMERIC_SCALE, 0) AS NUMERIC_SCALE,
            cast(ISNULL(P.DATETIME_PRECISION, 0) as int) AS DATETIME_PRECISION,
            R.ROUTINE_TYPE,
            cast(R.DATA_TYPE as nvarchar(32)) as RETURN_DATA_TYPE,
            P.IS_RESULT
    FROM    INFORMATION_SCHEMA.ROUTINES R
            left outer JOIN INFORMATION_SCHEMA.PARAMETERS P
                ON P.SPECIFIC_SCHEMA = R.SPECIFIC_SCHEMA
                AND P.SPECIFIC_NAME = R.SPECIFIC_NAME
                --AND R.ROUTINE_TYPE = 'FUNCTION'
    WHERE   -- P.IS_RESULT = 'NO' AND
            R.SPECIFIC_NAME IN ('${functionNames.join("\',\'")}')
            AND R.SPECIFIC_SCHEMA + R.SPECIFIC_NAME IN (
                SELECT  SCHEMA_NAME(sp.schema_id) + sp.name
                FROM    sys.all_objects AS sp
                        LEFT OUTER JOIN sys.all_sql_modules AS sm
                            ON sm.object_id = sp.object_id
                WHERE   --sp.type = 'FN'
                        --AND 
                        (
                            CAST(CASE WHEN sp.is_ms_shipped = 1 THEN 1
                                    WHEN (SELECT major_id
                                            FROM   sys.extended_properties
                                            WHERE  major_id = sp.object_id
                                                    AND minor_id = 0
                                                    AND class = 1
                                                    AND name = N'microsoft_database_tools_support') IS NOT NULL THEN 1
                                    ELSE 0
                                END AS BIT) = 0
                            )
            )
    ORDER BY P.SPECIFIC_SCHEMA,
            P.SPECIFIC_NAME,
            P.ORDINAL_POSITION`;
    return new Promise((res, rej) => {
        var rows = [];
        dbUtils.executeSql(
            config,
            { sql: sql },
            row => rows.push({
                database: config.database,
                schema: row[0].value,
                name: row[1].value,
                ordinalPosition: row[2].value,
                parameterMode: row[3].value,
                parameterName: row[4].value,
                dataType: row[5].value,
                characterMaximumLength: row[6].value,
                numericPrecision: row[7].value,
                numericScale: row[8].value,
                datetimePrecision: row[9].value,
                routineType: row[10].value,
                returnDataType: row[11].value,
                isResult: row[12].value
            }),
            rowCount => {
                res(rows);
            },
            error => {
                rej(error);
            });
    });
}

function createParameters(name, parmRows) {
    return parmRows.map(r => ({
        ordinal: r.ordinalPosition,
        parameterMode: r.parameterMode,
        parameterName: r.parameterName,
        dataType: r.dataType,
        maxLength: r.characterMaximumLength,
        precision: r.numericPrecision,
        scale: r.numericScale,
        datetimePrecision: r.datetimePrecision
    }));
}

async function createReturnColumns(config, name, parmRows, funcType) {
    let sql = "";
    if (funcType === "tvf") {
        const parms = parmRows.map(r => "null").join(",");
        sql = `select * from ${name}(${parms});`;
    } else {
        const parms = parmRows.map(r => `${r.parameterName}=null`).join(",");
        sql = `execute ${name} ${parms};`;
    }

    return new Promise((res, rej) => {
        let colInfos = [];
        dbUtils.executeSqlFmtOnly(
            config,
            { sql },
            cols => {
                colInfos = cols.map(c => ({
                    name: c.colName,
                    dataType: c.type.name,
                    maxLength: c.type.maximumLength
                }));
            },
            rowCount => {
                res(colInfos);
            },
            error => {
                rej(error);
            });
    });
}

async function createFunction(config, name, allRows, funcType) {
    const funcRows = allRows.filter(r => r.name.toUpperCase() === name.toUpperCase());
    const parmRows = funcRows.filter(r => r.isResult && r.isResult.toUpperCase() === "NO");
    const parameters = createParameters(name, parmRows);

    if (funcType === "sf") {
        // scalar function
        const returnTypeRow = funcRows.find(r => r.isResult && r.isResult.toUpperCase() === "YES");
        return {
            database: config.database,
            schema: funcRows[0].schema,
            name,
            parameters,
            returnDataType: returnTypeRow.returnDataType
        };
    } else {
        // table value function, stored proc
        const returnColumns = await createReturnColumns(config, name, parmRows, funcType);
        return {
            database: config.database,
            schema: funcRows[0].schema,
            name,
            parameters,
            returnColumns
        };
    }
}

async function createFunctions(config, functionNames, funcType) {
    const rows = await dbFunctions(config, functionNames);
    const names = utils.distinct(rows, r => r.name);
    return Promise.all(names.map(async n => await createFunction(config, n, rows, funcType)));
}

function tableValueFunctionNames(config) {
    var sql = ` select 
            r.SPECIFIC_SCHEMA,
            r.SPECIFIC_NAME
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='function'
                      and r.data_type='table'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push({
                database: config.database,
                schema: row[0].value,
                name: row[1].value
            }),
            rowCount => {
                res(rows.filter(r => r.name));
            },
            error => {
                rej(error);
            });
    });
}

function tableValueFunctions(config, functionNames) {
    return createFunctions(config, functionNames, "tvf");
}

async function tableValueFunction(config, functionName) {
    const funcs = await tableValueFunctions(config, [functionName]);
    if (funcs.length == 0)
        throw (`TableValueFunction "${functionName}" does not exist.`);
    return funcs[0];
}

function storedProcedureNames(config) {
    var sql = ` select 
            r.SPECIFIC_SCHEMA,
            r.SPECIFIC_NAME
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='procedure'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push({
                database: config.database,
                schema: row[0].value,
                name: row[1].value
            }),
            rowCount => {
                res(rows.filter(r => r.name));
            },
            error => {
                rej(error);
            });
    });
}

function storedProcedures(config, functionNames) {
    return createFunctions(config, functionNames, "sp");
}

async function storedProcedure(config, functionName) {
    const funcs = await storedProcedures(config, [functionName]);
    if (funcs.length == 0)
        throw (`StoredProcedure "${functionName}" does not exist.`);
    return funcs[0];
}

function scalarFunctionNames(config) {
    var sql = ` select 
            r.SPECIFIC_SCHEMA,
            r.SPECIFIC_NAME
              from	 information_schema.routines(nolock) r
              where	  r.routine_type='function'
                      and r.data_type!='table'`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push({
                database: config.database,
                schema: row[0].value,
                name: row[1].value
            }),
            rowCount => {
                res(rows.filter(r => r.name));
            },
            error => {
                rej(error);
            });
    });
}

function scalarFunctions(config, functionNames) {
    return createFunctions(config, functionNames, "sf");
}

async function scalarFunction(config, functionName) {
    const funcs = await scalarFunctions(config, [functionName]);
    if (funcs.length == 0)
        throw (`ScalarFunction "${functionName}" does not exist.`);
    return funcs[0];
}

function functionDefinition(config, functionName) {
    const sql = ` select  sm.definition
              from    sys.sql_modules AS sm
                      join sys.objects AS o 
                        on sm.object_id = o.object_id
              where   o.name = @routine_name`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            {
                sql,
                parms: [
                    {
                        name: 'routine_name',
                        type: TYPES.VarChar,
                        value: functionName
                    }
                ]
            },
            row => rows.push(row),
            rowCount => {
                if (rows[0] && rows[0][0])
                    res(rows[0][0].value);
                else
                    res(null);
            },
            error => {
                rej(error);
            });
    });
}

module.exports = {
    tableValueFunctionNames,
    tableValueFunction,
    tableValueFunctions,

    storedProcedureNames,
    storedProcedure,
    storedProcedures,

    scalarFunctionNames,
    scalarFunction,
    scalarFunctions,

    functionDefinition
};