
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