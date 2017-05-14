/**
 * Returns schema info for the given table name
 * @param {string} tablename - The name of the table in the database.
 */
async function getTable(tableName) {
    return "Schema of " + tableName;
}


module.exports = {
    getTable
}