
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