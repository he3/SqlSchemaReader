
const dbSchema = require("../src/sqlSchemaReader.js")





// Show table details in console.

run();

async function run(){
    console.log("Starting");

    const tableSchema = await getTableSchema("ADM_Company_M");
    console.log(tableSchema);

    console.log("Finished");
}

async function getTableSchema(tableName){
    return await dbSchema.getTable(tableName);
}