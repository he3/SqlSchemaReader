
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