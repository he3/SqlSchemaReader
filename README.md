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

## Outputs
```javascript
// tableNames
[ 
    { 
        "database": "dbName", 
        "schema": "dbo", 
        "name": "tableName" 
    }
]

// table
{
    "database": "dbName",
    "schema": "dbo",
    "name": "tableName",
    "tableType": "BASE TABLE",
    "columns": [
        {
            "ordinal": 1,
            "columnName": "columnName",
            "isNullable": false,
            "typeName": "nvarchar",
            "maxLength": 8,
            "precision": 0,
            "default": "",
            "dateTimePrecision": 0,
            "scale": 0,
            "isIdentity": false,
            "isStoreGenerated": false,
            "primaryKey": true,
            "isFixedLength": false,
            "hasPrecisionAndScale": false,
            "isRowVersion": false
        }
    ],
    "primaryKeys": [
        {
            "ordinal": 1,
            "columnName": "columnName",
            "isNullable": false,
            "typeName": "nvarchar",
            "maxLength": 8,
            "precision": 0,
            "default": "",
            "dateTimePrecision": 0,
            "scale": 0,
            "isIdentity": false,
            "isStoreGenerated": false,
            "primaryKey": true,
            "isFixedLength": false,
            "hasPrecisionAndScale": false,
            "isRowVersion": false
        }
    ],
    "foreignKeys": [
        {
            "pkTableName": "tableName2",
            "constraintName": "FK_tableName_tableName2",
            "columns": [
                {
                    "fkColumn": {
                        "ordinal": 1,
                        "columnName": "columnName",
                        "isNullable": false,
                        "typeName": "nvarchar",
                        "maxLength": 64,
                        "precision": 0,
                        "default": "",
                        "dateTimePrecision": 0,
                        "scale": 0,
                        "isIdentity": false,
                        "isStoreGenerated": false,
                        "primaryKey": false,
                        "isFixedLength": false,
                        "hasPrecisionAndScale": false,
                        "isRowVersion": false
                    },
                    "pkColumn": {
                        "ordinal": 1,
                        "columnName": "columnName",
                        "isNullable": false,
                        "typeName": "nvarchar",
                        "maxLength": 64,
                        "precision": 0,
                        "default": "",
                        "dateTimePrecision": 0,
                        "scale": 0,
                        "isIdentity": false,
                        "isStoreGenerated": false,
                        "primaryKey": true,
                        "isFixedLength": false,
                        "hasPrecisionAndScale": false,
                        "isRowVersion": false
                    },
                    "ordinal": 1
                }
            ],
            "relationship": "manyToOne"
        }
    ],
    "reverseNavigations": [
        {
            "fkTableName": "tableName3",
            "constraintName": "FK_tableName3_tableName",
            "columns": [
                {
                    "fkColumn": {
                        "ordinal": 1,
                        "columnName": "columnName",
                        "isNullable": false,
                        "typeName": "nvarchar",
                        "maxLength": 64,
                        "precision": 0,
                        "default": "",
                        "dateTimePrecision": 0,
                        "scale": 0,
                        "isIdentity": false,
                        "isStoreGenerated": false,
                        "primaryKey": false,
                        "isFixedLength": false,
                        "hasPrecisionAndScale": false,
                        "isRowVersion": false
                    },
                        "pkColumn": {
                        "ordinal": 1,
                        "columnName": "columnName",
                        "isNullable": false,
                        "typeName": "nvarchar",
                        "maxLength": 64,
                        "precision": 0,
                        "default": "",
                        "dateTimePrecision": 0,
                        "scale": 0,
                        "isIdentity": false,
                        "isStoreGenerated": false,
                        "primaryKey": true,
                        "isFixedLength": false,
                        "hasPrecisionAndScale": false,
                        "isRowVersion": false
                    },
                    "ordinal": 1
                }
            ],
            "relationship": "manyToOne"
        }
    ]
}

// tables: Array of Tables

// tableValueFunctionNames
[ 
    { 
        "database": "dbName",
        "schema": "dbo",
        "name": "tvFunctionName" 
    }
]

// tableValueFunction
{
    "database": "dbName",
    "schema": "dbo",
    "name": "tvFunctionName",
    "parameters": [
        {
            "ordinal": 1,
            "parameterMode": "IN",
            "parameterName": "@parmName",
            "dataType": "nchar",
            "maxLength": 2,
            "precision": 0,
            "scale": 0,
            "datetimePrecision": 0
        }
    ],
    "returnColumns": [
        {
            "name": "colName1",
            "dataType": "int"
        },
        {
            "name": "colName2",
            "dataType": "nvarchar",
            "maxLength": 4000
        }
    ]
}

 // tableValueFunctions: Array of table value functions

 // storedProcedureNames
 [ 
    { 
        "database": "dbName",
        "schema": "dbo",
        "name": "storedProcedureName" 
    }
]

// storedProcedure
{
    "database": "dbName",
    "schema": "dbo",
    "name": "storedProcedureName",
    "parameters": [
        {
            "ordinal": 1,
            "parameterMode": "IN",
            "parameterName": "@parmName",
            "dataType": "nchar",
            "maxLength": 2,
            "precision": 0,
            "scale": 0,
            "datetimePrecision": 0
        }
    ],
    "returnColumns": [
        {
            "name": "colName1",
            "dataType": "int"
        },
        {
            "name": "colName2",
            "dataType": "nvarchar",
            "maxLength": 4000
        }
    ]
}

// storedProcedures: Array of stored procedures

// scalarFunctionNames
 [ 
    { 
        "database": "dbName",
        "schema": "dbo",
        "name": "scalarFunctionName" 
    }
]

// scalarFunction
{
    "database": "dbName",
    "schema": "dbo",
    "name": "scalarFunctionName",
    "parameters": [
        {
            "ordinal": 1,
            "parameterMode": "IN",
            "parameterName": "@parmName",
            "dataType": "nchar",
            "maxLength": 2,
            "precision": 0,
            "scale": 0,
            "datetimePrecision": 0
        }
    ],
    "returnDataType": "varchar"
}

// scalarFunctions: Array of scalar functions
```

## Schema Read Error
Sometimes the metadata of return columns for stored procedures cannot be read.
The output will have a schemaReadError when this happens.
Known causes:
- When a stored procedure uses a #TempTable, the return columns cannot be read.
- When a stored procedure is invalid, for example a table does not exist.
```javascript
{
    "database": "dbName",
    "schema": "dbo",
    "name": "storedProcedureName",
    "parameters": [],
    "schemaReadError" = {
        message: "SQL Schema Reader error message.",
        error: originalErrorResponse
    }
}
```