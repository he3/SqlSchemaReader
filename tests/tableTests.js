
const config = require("../config.json")
const dbTables = require("../src/tablesReader.js")





// Show table details in console.

run();

async function run(){
    console.log("Starting");

    const tableSchema = await getTableSchema("ADM_Company_M");
    console.log(tableSchema);

    console.log("Finished");
}

async function getTableSchema(tableName){
    return await dbTables.names({
        server:config.server,
        database:"stinv",
        username:config.username,
        password:config.password
    });
}