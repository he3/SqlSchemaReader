# SqlSchemaReader
Read SQL Server schema information. Uses Tedious.js.

## Usage
```javascript
const schemaReader = require("sql-schema-reader");

async function go(){
    const config = {
        "server":"server",
        "database": "dbName",
        "username":"",
        "password":""  
    };

    // Tables
    const tableNames = await schemaReader.tableNames(config);
    console.log(tableNames);

    const table = await schemaReader.table(config, "tableName");
    console.log(table);


    // Stored Procedures
    const procNames = await schemaReader.procNames(config);
    console.log(procNames);

    const proc = await schemaReader.proc(config, "procName");
    console.log(proc);

    const procDefinition = await schemaReader.procDefinition(config, "procName");
    console.log(procDefinition);


    // Table Value Functions
    const functionNames = await schemaReader.functionNames(config);
    console.log(functionNames);

    const func = await schemaReader.function(config, "functionName");
    console.log(func);

    const functionDefinition = await schemaReader.functionDefinition(config, "functionName");
    console.log(functionDefinition);


    // Scalar Functions
    const scalarNames = await schemaReader.scalarNames(config);
    console.log(scalarNames);

    const scalar = await schemaReader.scalar(config, "scalarName");
    console.log(scalar);

    const scalarDefinition = await schemaReader.scalarDefinition(config, "scalarName");
    console.log(scalarDefinition);
}

go();
```