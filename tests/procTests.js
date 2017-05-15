
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