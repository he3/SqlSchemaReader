# SqlSchemaReader
Read SQL Server schema information. Uses Tedious.js.

## install
```
npm install sql-schema-reader
```

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

    const tables = await schemaReader.tables(config, ["tableName1", "tableName2"]);
    console.log(tables);


    // Stored Procedures
    const procNames = await schemaReader.storedProcedureNames(config);
    console.log(procNames);

    const proc = await schemaReader.storedProcedure(config, "procName");
    console.log(proc);

    const procs = await schemaReader.storedProcedures(config, ["procName1", "procName2"]);
    console.log(procs);

    const procDefinition = await schemaReader.functionDefinition(config, "procName");
    console.log(procDefinition);


    // Table Value Functions
    const functionNames = await schemaReader.tableValueFunctionNames(config);
    console.log(functionNames);

    const func = await schemaReader.tableValueFunction(config, "functionName");
    console.log(func);

    const funcs = await schemaReader.tableValueFunctions(config, ["functionName1", "functionName2"]);
    console.log(funcs);

    const functionDefinition = await schemaReader.functionDefinition(config, "functionName");
    console.log(functionDefinition);


    // Scalar Functions
    const scalarNames = await schemaReader.scalarFunctionNames(config);
    console.log(scalarNames);

    const scalar = await schemaReader.scalarFunction(config, "scalarName");
    console.log(scalar);

    const scalars = await schemaReader.scalarFunctions(config, ["scalarName1", "scalarName2"]);
    console.log(scalars);

    const scalarDefinition = await schemaReader.functionDefinition(config, "scalarName");
    console.log(scalarDefinition);
}

go();
```