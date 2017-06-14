const configReader = require("./configReader.js")
const schemaReader = require("../src/index.js");

go();

async function go() {
    const config = configReader.databases["npdb"];

    // const tableNames = await schemaReader.tableNames(config);
    // console.log(tableNames);
    // const tableResult = await schemaReader.table(config, "ADM_OPCTagType_M");
    // console.log(JSON.stringify(tableResult, null, " "));
    // const tablesResult = await schemaReader.tables(config, [
    //     "ADM_ProductionLineProduct_R", 
    //     "ADM_ProductionLine_M"
    // ]);
    //console.log(tablesResult);
    //console.log(JSON.stringify(tablesResult, null, " "));

    // const funcNames = await schemaReader.tableValueFunctionNames(config);
    // console.log(funcNames);
    // const funcResult = await schemaReader.tableValueFunctions(config, ["fn_ADM_City_D_get", "fn_ADM_Country_M_get"]);
    // console.log(JSON.stringify(funcResult, null, " "));

    // const procNames = await schemaReader.storedProcedureNames(config);
    // console.log(procNames);
    // stinv.proc_DEV_ttp_create_cartons, npdb.proc_dev_test_he3
    // const procResult = await schemaReader.storedProcedure(config, ["proc_dev_test_he3"]);
    // console.log(JSON.stringify(procResult, null, " ")); 

    // const scalarNames = await schemaReader.scalarFunctionNames(config);
    // console.log(scalarNames);
    // const scalarResult = await schemaReader.scalarFunction(config, ["sfn_EPCIS_generate_SGLN_EPC_URI"]);
    // console.log(JSON.stringify(scalarResult, null, " ")); 
}