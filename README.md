# SqlSchemaReader
Read SQL Server schema information.

## Usage
```javascript
const dbTables = require("../src/tablesReader.js")
const dbProcs = require("../src/procsReader.js")
const dbFuncs = require("../src/functionsReader.js")
const dbScalars = require("../src/scalarsReader.js")

const config = {
    "server":"server",
    "database": "dbName",
    "username":"",
    "password":""  
};

// Get all table names
dbTables.names(config);

// Get table schema info
dbTables.table(config, "tableName");

// Get all stored procedure names
dbProcs.names(config);

// Get stored procedure schema info
dbProcs.proc(config, "procName");

// Get stored procedure definition
dbProcs.definition(config, "procName");

// Get all table value function names
dbFuncs.names(config);

// Get table value function schema info
dbFuncs.function(config, "functionName");

// Get table value function definition
dbFuncs.definition(config, "functionName");

// Get all scalar function names
dbScalars.names(config);

// Get scalar function schema info
dbScalars.scalar(config, "scalarFunctionName");

// Get scalar function definition
dbScalars.definition(config, "scalarFunctionName");
```