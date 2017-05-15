# SqlSchemaReader

## Usage

### Config File
Copy config-example.json to c:\SqlSchemaReader\config.json.
Update the file to your database connection settings.

### Tables
```javascript
const config = require("../src/configReader.js")
const dbTables = require("../src/tablesReader.js")

// Show table details in console.

run();

async function run(){
    console.log("Starting");

    const tableNames = await getTableNames("npdb");
    console.log(tableNames);

    const tableSchema = await getTableSchema("stinv", "ADM_Company_M");
    console.log(tableSchema);

    console.log("Finished");
}

async function getTableSchema(dbName, tableName){
    return await dbTables.table(config.databases[dbName], tableName);
}

async function getTableNames(dbName){
    return await dbTables.names(config.databases[dbName]);
}
```

### Stored Procedures
```javascript
const config = require("../src/configReader.js")
const dbProcs = require("../src/procsReader.js")

// Show proc details in console.

run();

async function run(){
    console.log("Starting");

    const procNames = await getProcNames("npdb");
    console.log(procNames);

    const procSchema = await getProcSchema("npdb", "proc_get_order_shipping_location");
    console.log(procSchema);

    const procDefinition = await getProcDefinition("npdb", "proc_get_order_shipping_location");
    console.log(procDefinition);

    console.log("Finished");
}

async function getProcDefinition(dbName, procName){
    return await dbProcs.definition(config.databases[dbName], procName);
}

async function getProcSchema(dbName, procName){
    return await dbProcs.proc(config.databases[dbName], procName);
}

async function getProcNames(dbName){
    return await dbProcs.names(config.databases[dbName]);
}
```

### Table Value Functions
```javascript
const config = require("../src/configReader.js")
const dbFuncs = require("../src/functionsReader.js")

// Show function details in console.

run();

async function run(){
    console.log("Starting");

    const functionNames = await getFunctionNames("npdb");
    console.log(functionNames);

    const functionSchema = await getFunctionSchema("npdb", "fn_POR_get_price_group_item_usage");
    console.log(functionSchema);

    const functionDefinition = await getFunctionDefinition("npdb", "fn_POR_get_price_group_item_usage");
    console.log(functionDefinition);

    console.log("Finished");
}

async function getFunctionDefinition(dbName, functionName){
    return await dbFuncs.definition(config.databases[dbName], functionName);
}

async function getFunctionSchema(dbName, functionName){
    return await dbFuncs.function(config.databases[dbName], functionName);
}

async function getFunctionNames(dbName){
    return await dbFuncs.names(config.databases[dbName]);
}
```

### Scalar Functions

``` javascript
const config = require("../src/configReader.js")
const dbScalars = require("../src/scalarsReader.js")

// Show scalar details in console.

run();

async function run(){
    console.log("Starting");

    const scalarNames = await getScalarNames("npdb");
    console.log(scalarNames);

    const scalarSchema = await getScalarSchema("npdb", "fn_CBR_credit_memo_processed_status");
    console.log(scalarSchema);

    const scalarDefinition = await getScalarDefinition("npdb", "fn_CBR_credit_memo_processed_status");
    console.log(scalarDefinition);

    console.log("Finished");
}

async function getScalarDefinition(dbName, scalarName){
    return await dbScalars.definition(config.databases[dbName], scalarName);
}

async function getScalarSchema(dbName, scalarName){
    return await dbScalars.scalar(config.databases[dbName], scalarName);
}

async function getScalarNames(dbName){
    return await dbScalars.names(config.databases[dbName]);
}
```