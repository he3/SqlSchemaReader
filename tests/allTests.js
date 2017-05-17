const configReader = require("./configReader.js")
const schemaReader = require("../src/sqlSchemaReader.js");

go();

async function go(){
    const config = configReader.databases["stinv"];
    
    const tableNames = await schemaReader.tableNames(config);
    console.log(tableNames);
}

// TODO: new syntax
// Get all table names
// dbTables.names(config).then(names => {
//     console.log(names);
// });

// // Get table schema info
// dbTables.table(config, "tableName");

// // Get all stored procedure names
// dbProcs.names(config);

// // Get stored procedure schema info
// dbProcs.proc(config, "procName");

// // Get stored procedure definition
// dbProcs.definition(config, "procName");

// // Get all table value function names
// dbFuncs.names(config);

// // Get table value function schema info
// dbFuncs.function(config, "functionName");

// // Get table value function definition
// dbFuncs.definition(config, "functionName");

// // Get all scalar function names
// dbScalars.names(config);

// // Get scalar function schema info
// dbScalars.scalar(config, "scalarFunctionName");

// // Get scalar function definition
// dbScalars.definition(config, "scalarFunctionName");