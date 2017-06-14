const dbTables = require("./tablesReader.js")
const dbFuncs = require("./functionsReader.js")

module.exports = {
    tableNames: dbTables.names,
    table: dbTables.table,
    tables: dbTables.tables,
    
    tableValueFunctionNames: dbFuncs.tableValueFunctionNames,
    tableValueFunction: dbFuncs.tableValueFunction,
    tableValueFunctions: dbFuncs.tableValueFunctions,

    storedProcedureNames: dbFuncs.storedProcedureNames,
    storedProcedure: dbFuncs.storedProcedure,
    storedProcedures: dbFuncs.storedProcedures,

    scalarFunctionNames: dbFuncs.scalarFunctionNames,
    scalarFunction: dbFuncs.scalarFunction,
    scalarFunctions: dbFuncs.scalarFunctions,

    functionDefinition: dbFuncs.functionDefinition,
};