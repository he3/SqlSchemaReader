const dbTables = require("./tablesReader.js")
const dbProcs = require("./procsReader.js")
const dbFuncs = require("./functionsReader.js")
const dbScalars = require("./scalarsReader.js")

module.exports = {
    tableNames: dbTables.names,
    table: dbTables.table,
    
    functionNames: dbFuncs.names,
    function: dbFuncs.function,
    functionDefinition: dbFuncs.definition,

    scalarNames: dbScalars.names,
    scalar: dbScalars.scalar,
    scalarDefinition: dbScalars.definition,

    procNames: dbProcs.names,
    proc: dbProcs.proc,
    procDefinition: dbProcs.definition
};