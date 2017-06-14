var utils = require('./utils.js');
var dbUtils = require('./dbUtils.js');
var TYPES = dbUtils.TYPES;

function column(cols) {
    return {
        ordinal: cols[3].value,
        columnName: cols[4].value,
        isNullable: cols[5].value,
        typeName: cols[6].value,
        maxLength: cols[7].value,
        precision: cols[8].value,
        default: cols[9].value,
        dateTimePrecision: cols[10].value,
        scale: cols[11].value,
        isIdentity: cols[12].value,
        isStoreGenerated: cols[13].value,
        primaryKey: cols[14].value
    };
}

function fullTable(databaseName, tableName, rows) {
    const tableRows = rows.filter(r => r[1].value.toUpperCase() === tableName.toUpperCase());
    const columns = tableRows.map(column);
    const primaryKeys = columns.filter(c => c.primaryKey);

    return {
        database: databaseName,
        schema: tableRows[0][0].value,
        name: tableName,
        tableType: tableRows[0][2].value,
        columns,
        primaryKeys
    }
}

function fullTables(databaseName, rows) {
    const tableNames = utils.distinct(rows, row => row[1].value);
    return tableNames.map(n => fullTable(databaseName, n, rows));
}

/**
 * @param {config} config - The connection config.
 * @param {string} config.database - The name of the database to connect to.
 */
function names(config) {
    var sql = `select table_schema, table_name
              FROM INFORMATION_SCHEMA.TABLES (nolock)
              WHERE	TABLE_TYPE IN ('BASE TABLE', 'VIEW')`;

    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push({
                database: config.database,
                schema: row[0].value,
                name: row[1].value
            }),
            rowCount => {
                res(rows);
            },
            error => {
                rej(error);
            });
    });
};

function tableInfos(config, tableNames) {

    var sql = `SELECT  
        [Extent1].[SchemaName],
        [Extent1].[Name] AS TableName,
        [Extent1].[TABLE_TYPE] AS TableType,
        [UnionAll1].[Ordinal],
        [UnionAll1].[Name] AS ColumnName,
        [UnionAll1].[IsNullable],
        [UnionAll1].[TypeName],
        ISNULL([UnionAll1].[MaxLength],0) AS MaxLength,
        ISNULL([UnionAll1].[Precision], 0) AS Precision,
        ISNULL([UnionAll1].[Default], '') AS [Default],
        ISNULL([UnionAll1].[DateTimePrecision], '') AS [DateTimePrecision],
        ISNULL([UnionAll1].[Scale], 0) AS Scale,
        [UnionAll1].[IsIdentity],
        [UnionAll1].[IsStoreGenerated],
        CASE WHEN ([Project5].[C2] IS NULL) THEN CAST(0 AS BIT)
             ELSE [Project5].[C2]
        END AS PrimaryKey
FROM    (
         SELECT QUOTENAME(TABLE_SCHEMA) + QUOTENAME(TABLE_NAME) [Id],
                TABLE_SCHEMA [SchemaName],
                TABLE_NAME [Name],
                TABLE_TYPE
         FROM   INFORMATION_SCHEMA.TABLES (nolock)
         WHERE  TABLE_TYPE IN ('BASE TABLE', 'VIEW')
        ) AS [Extent1]
        INNER JOIN (
                    SELECT  [Extent2].[Id] AS [Id],
                            [Extent2].[Name] AS [Name],
                            [Extent2].[Ordinal] AS [Ordinal],
                            [Extent2].[IsNullable] AS [IsNullable],
                            [Extent2].[TypeName] AS [TypeName],
                            [Extent2].[MaxLength] AS [MaxLength],
                            [Extent2].[Precision] AS [Precision],
                            [Extent2].[Default],
                            [Extent2].[DateTimePrecision] AS [DateTimePrecision],
                            [Extent2].[Scale] AS [Scale],
                            [Extent2].[IsIdentity] AS [IsIdentity],
                            [Extent2].[IsStoreGenerated] AS [IsStoreGenerated],
                            0 AS [C1],
                            [Extent2].[ParentId] AS [ParentId]
                    FROM    (
                             SELECT QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) + QUOTENAME(c.COLUMN_NAME) [Id],
                                    QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) [ParentId],
                                    c.COLUMN_NAME [Name],
                                    c.ORDINAL_POSITION [Ordinal],
                                    CAST(CASE c.IS_NULLABLE
                                           WHEN 'YES' THEN 1
                                           WHEN 'NO' THEN 0
                                           ELSE 0
                                         END AS BIT) [IsNullable],
                                    CASE WHEN c.DATA_TYPE IN ('varchar', 'nvarchar', 'varbinary')
                                              AND c.CHARACTER_MAXIMUM_LENGTH = -1 THEN c.DATA_TYPE + '(max)'
                                         ELSE c.DATA_TYPE
                                    END AS [TypeName],
                                    c.CHARACTER_MAXIMUM_LENGTH [MaxLength],
                                    CAST(c.NUMERIC_PRECISION AS INTEGER) [Precision],
                                    CAST(c.DATETIME_PRECISION AS INTEGER) [DateTimePrecision],
                                    CAST(c.NUMERIC_SCALE AS INTEGER) [Scale],
                                    c.COLLATION_CATALOG [CollationCatalog],
                                    c.COLLATION_SCHEMA [CollationSchema],
                                    c.COLLATION_NAME [CollationName],
                                    c.CHARACTER_SET_CATALOG [CharacterSetCatalog],
                                    c.CHARACTER_SET_SCHEMA [CharacterSetSchema],
                                    c.CHARACTER_SET_NAME [CharacterSetName],
                                    CAST(0 AS BIT) AS [IsMultiSet],
                                    CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)), c.COLUMN_NAME, 'IsIdentity') AS BIT) AS [IsIdentity],
                                    CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)), c.COLUMN_NAME, 'IsComputed')
                                    | CASE WHEN c.DATA_TYPE = 'timestamp' THEN 1
                                           ELSE 0
                                      END AS BIT) AS [IsStoreGenerated],
                                    c.COLUMN_DEFAULT AS [Default]
                             FROM   INFORMATION_SCHEMA.COLUMNS c
                                    INNER JOIN INFORMATION_SCHEMA.TABLES t
                                        ON c.TABLE_CATALOG = t.TABLE_CATALOG
                                           AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
                                           AND c.TABLE_NAME = t.TABLE_NAME
                                           AND t.TABLE_TYPE IN ('BASE TABLE', 'VIEW')
                            ) AS [Extent2]
                    UNION ALL
                    SELECT  [Extent3].[Id] AS [Id],
                            [Extent3].[Name] AS [Name],
                            [Extent3].[Ordinal] AS [Ordinal],
                            [Extent3].[IsNullable] AS [IsNullable],
                            [Extent3].[TypeName] AS [TypeName],
                            [Extent3].[MaxLength] AS [MaxLength],
                            [Extent3].[Precision] AS [Precision],
                            [Extent3].[Default],
                            [Extent3].[DateTimePrecision] AS [DateTimePrecision],
                            [Extent3].[Scale] AS [Scale],
                            [Extent3].[IsIdentity] AS [IsIdentity],
                            [Extent3].[IsStoreGenerated] AS [IsStoreGenerated],
                            6 AS [C1],
                            [Extent3].[ParentId] AS [ParentId]
                    FROM    (
                             SELECT QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) + QUOTENAME(c.COLUMN_NAME) [Id],
                                    QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) [ParentId],
                                    c.COLUMN_NAME [Name],
                                    c.ORDINAL_POSITION [Ordinal],
                                    CAST(CASE c.IS_NULLABLE
                                           WHEN 'YES' THEN 1
                                           WHEN 'NO' THEN 0
                                           ELSE 0
                                         END AS BIT) [IsNullable],
                                    CASE WHEN c.DATA_TYPE IN ('varchar', 'nvarchar', 'varbinary')
                                              AND c.CHARACTER_MAXIMUM_LENGTH = -1 THEN c.DATA_TYPE + '(max)'
                                         ELSE c.DATA_TYPE
                                    END AS [TypeName],
                                    c.CHARACTER_MAXIMUM_LENGTH [MaxLength],
                                    CAST(c.NUMERIC_PRECISION AS INTEGER) [Precision],
                                    CAST(c.DATETIME_PRECISION AS INTEGER) AS [DateTimePrecision],
                                    CAST(c.NUMERIC_SCALE AS INTEGER) [Scale],
                                    c.COLLATION_CATALOG [CollationCatalog],
                                    c.COLLATION_SCHEMA [CollationSchema],
                                    c.COLLATION_NAME [CollationName],
                                    c.CHARACTER_SET_CATALOG [CharacterSetCatalog],
                                    c.CHARACTER_SET_SCHEMA [CharacterSetSchema],
                                    c.CHARACTER_SET_NAME [CharacterSetName],
                                    CAST(0 AS BIT) AS [IsMultiSet],
                                    CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)), c.COLUMN_NAME, 'IsIdentity') AS BIT) AS [IsIdentity],
                                    CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)), c.COLUMN_NAME, 'IsComputed')
                                    | CASE WHEN c.DATA_TYPE = 'timestamp' THEN 1
                                           ELSE 0
                                      END AS BIT) AS [IsStoreGenerated],
                                    c.COLUMN_DEFAULT [Default]
                             FROM   INFORMATION_SCHEMA.COLUMNS c
                                    INNER JOIN INFORMATION_SCHEMA.VIEWS v
                                        ON c.TABLE_CATALOG = v.TABLE_CATALOG
                                           AND c.TABLE_SCHEMA = v.TABLE_SCHEMA
                                           AND c.TABLE_NAME = v.TABLE_NAME
                             WHERE  NOT (
                                         v.TABLE_SCHEMA = 'dbo'
                                         AND v.TABLE_NAME IN ('syssegments', 'sysconstraints')
                                         AND SUBSTRING(CAST(SERVERPROPERTY('productversion') AS VARCHAR(20)), 1, 1) = 8
                                        )
                            ) AS [Extent3]
                   ) AS [UnionAll1]
            ON (0 = [UnionAll1].[C1])
               AND ([Extent1].[Id] = [UnionAll1].[ParentId])
        LEFT OUTER JOIN (
                         SELECT [UnionAll2].[Id] AS [C1],
                                CAST(1 AS BIT) AS [C2]
                         FROM   (
                                 SELECT QUOTENAME(tc.CONSTRAINT_SCHEMA) + QUOTENAME(tc.CONSTRAINT_NAME) [Id],
                                        QUOTENAME(tc.TABLE_SCHEMA) + QUOTENAME(tc.TABLE_NAME) [ParentId],
                                        tc.CONSTRAINT_NAME [Name],
                                        tc.CONSTRAINT_TYPE [ConstraintType],
                                        CAST(CASE tc.IS_DEFERRABLE
                                               WHEN 'NO' THEN 0
                                               ELSE 1
                                             END AS BIT) [IsDeferrable],
                                        CAST(CASE tc.INITIALLY_DEFERRED
                                               WHEN 'NO' THEN 0
                                               ELSE 1
                                             END AS BIT) [IsInitiallyDeferred]
                                 FROM   INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                                 WHERE  tc.TABLE_NAME IS NOT NULL
                                ) AS [Extent4]
                                INNER JOIN (
                                            SELECT  7 AS [C1],
                                                    [Extent5].[ConstraintId] AS [ConstraintId],
                                                    [Extent6].[Id] AS [Id]
                                            FROM    (
                                                     SELECT QUOTENAME(CONSTRAINT_SCHEMA) + QUOTENAME(CONSTRAINT_NAME) [ConstraintId],
                                                            QUOTENAME(TABLE_SCHEMA) + QUOTENAME(TABLE_NAME) + QUOTENAME(COLUMN_NAME) [ColumnId]
                                                     FROM   INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                                                    ) AS [Extent5]
                                                    INNER JOIN (
                                                                SELECT  QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) + QUOTENAME(c.COLUMN_NAME) [Id],
                                                                        QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) [ParentId],
                                                                        c.COLUMN_NAME [Name],
                                                                        c.ORDINAL_POSITION [Ordinal],
                                                                        CAST(CASE c.IS_NULLABLE
                                                                               WHEN 'YES' THEN 1
                                                                               WHEN 'NO' THEN 0
                                                                               ELSE 0
                                                                             END AS BIT) [IsNullable],
                                                                        CASE WHEN c.DATA_TYPE IN ('varchar', 'nvarchar', 'varbinary')
                                                                                  AND c.CHARACTER_MAXIMUM_LENGTH = -1 THEN c.DATA_TYPE + '(max)'
                                                                             ELSE c.DATA_TYPE
                                                                        END AS [TypeName],
                                                                        c.CHARACTER_MAXIMUM_LENGTH [MaxLength],
                                                                        CAST(c.NUMERIC_PRECISION AS INTEGER) [Precision],
                                                                        CAST(c.DATETIME_PRECISION AS INTEGER) [DateTimePrecision],
                                                                        CAST(c.NUMERIC_SCALE AS INTEGER) [Scale],
                                                                        c.COLLATION_CATALOG [CollationCatalog],
                                                                        c.COLLATION_SCHEMA [CollationSchema],
                                                                        c.COLLATION_NAME [CollationName],
                                                                        c.CHARACTER_SET_CATALOG [CharacterSetCatalog],
                                                                        c.CHARACTER_SET_SCHEMA [CharacterSetSchema],
                                                                        c.CHARACTER_SET_NAME [CharacterSetName],
                                                                        CAST(0 AS BIT) AS [IsMultiSet],
                                                                        CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)),
                                                                                            c.COLUMN_NAME, 'IsIdentity') AS BIT) AS [IsIdentity],
                                                                        CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)),
                                                                                            c.COLUMN_NAME, 'IsComputed')
                                                                        | CASE WHEN c.DATA_TYPE = 'timestamp' THEN 1
                                                                               ELSE 0
                                                                          END AS BIT) AS [IsStoreGenerated],
                                                                        c.COLUMN_DEFAULT AS [Default]
                                                                FROM    INFORMATION_SCHEMA.COLUMNS c
                                                                        INNER JOIN INFORMATION_SCHEMA.TABLES t
                                                                            ON c.TABLE_CATALOG = t.TABLE_CATALOG
                                                                               AND c.TABLE_SCHEMA = t.TABLE_SCHEMA
                                                                               AND c.TABLE_NAME = t.TABLE_NAME
                                                                               AND t.TABLE_TYPE IN ('BASE TABLE', 'VIEW')
                                                               ) AS [Extent6]
                                                        ON [Extent6].[Id] = [Extent5].[ColumnId]
                                            UNION ALL
                                            SELECT  11 AS [C1],
                                                    [Extent7].[ConstraintId] AS [ConstraintId],
                                                    [Extent8].[Id] AS [Id]
                                            FROM    (
                                                     SELECT CAST( NULL AS NVARCHAR (1)) [ConstraintId], CAST( NULL AS NVARCHAR (MAX)) [ColumnId] WHERE 1= 2
                                                    ) AS [Extent7]
                                                    INNER JOIN (
                                                                SELECT  QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) + QUOTENAME(c.COLUMN_NAME) [Id],
                                                                        QUOTENAME(c.TABLE_SCHEMA) + QUOTENAME(c.TABLE_NAME) [ParentId],
                                                                        c.COLUMN_NAME [Name],
                                                                        c.ORDINAL_POSITION [Ordinal],
                                                                        CAST(CASE c.IS_NULLABLE
                                                                               WHEN 'YES' THEN 1
                                                                               WHEN 'NO' THEN 0
                                                                               ELSE 0
                                                                             END AS BIT) [IsNullable],
                                                                        CASE WHEN c.DATA_TYPE IN ('varchar', 'nvarchar', 'varbinary')
                                                                                  AND c.CHARACTER_MAXIMUM_LENGTH = -1 THEN c.DATA_TYPE + '(max)'
                                                                             ELSE c.DATA_TYPE
                                                                        END AS [TypeName],
                                                                        c.CHARACTER_MAXIMUM_LENGTH [MaxLength],
                                                                        CAST(c.NUMERIC_PRECISION AS INTEGER) [Precision],
                                                                        CAST(c.DATETIME_PRECISION AS INTEGER) AS [DateTimePrecision],
                                                                        CAST(c.NUMERIC_SCALE AS INTEGER) [Scale],
                                                                        c.COLLATION_CATALOG [CollationCatalog],
                                                                        c.COLLATION_SCHEMA [CollationSchema],
                                                                        c.COLLATION_NAME [CollationName],
                                                                        c.CHARACTER_SET_CATALOG [CharacterSetCatalog],
                                                                        c.CHARACTER_SET_SCHEMA [CharacterSetSchema],
                                                                        c.CHARACTER_SET_NAME [CharacterSetName],
                                                                        CAST(0 AS BIT) AS [IsMultiSet],
                                                                        CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)),
                                                                                            c.COLUMN_NAME, 'IsIdentity') AS BIT) AS [IsIdentity],
                                                                        CAST(COLUMNPROPERTY(OBJECT_ID(QUOTENAME(c.TABLE_SCHEMA) + '.' + QUOTENAME(c.TABLE_NAME)),
                                                                                            c.COLUMN_NAME, 'IsComputed')
                                                                        | CASE WHEN c.DATA_TYPE = 'timestamp' THEN 1
                                                                               ELSE 0
                                                                          END AS BIT) AS [IsStoreGenerated],
                                                                        c.COLUMN_DEFAULT [Default]
                                                                FROM    INFORMATION_SCHEMA.COLUMNS c
                                                                        INNER JOIN INFORMATION_SCHEMA.VIEWS v
                                                                            ON c.TABLE_CATALOG = v.TABLE_CATALOG
                                                                               AND c.TABLE_SCHEMA = v.TABLE_SCHEMA
                                                                               AND c.TABLE_NAME = v.TABLE_NAME
                                                                WHERE   NOT (
                                                                             v.TABLE_SCHEMA = 'dbo'
                                                                             AND v.TABLE_NAME IN ('syssegments', 'sysconstraints')
                                                                             AND SUBSTRING(CAST(SERVERPROPERTY('productversion') AS VARCHAR(20)), 1, 1) = 8
                                                                            )
                                                               ) AS [Extent8]
                                                        ON [Extent8].[Id] = [Extent7].[ColumnId]
                                           ) AS [UnionAll2]
                                    ON (7 = [UnionAll2].[C1])
                                       AND ([Extent4].[Id] = [UnionAll2].[ConstraintId])
                         WHERE  [Extent4].[ConstraintType] = N'PRIMARY KEY'
                        ) AS [Project5]
            ON [UnionAll1].[Id] = [Project5].[C1]
WHERE   ([Extent1].[Name] IN ('${tableNames.join("\',\'")}'))`;


    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push(row),
            rowCount => {
                res(fullTables(config.database, rows));
            },
            error => {
                rej(error);
            });
    });
};

function fkInfos(config, tableNames) {
    var sql = `
    SELECT DISTINCT
            FK.TABLE_NAME AS FK_Table,
            FK.COLUMN_NAME AS FK_Column,
            PK.TABLE_NAME AS PK_Table,
            PK.COLUMN_NAME AS PK_Column,
            FK.CONSTRAINT_NAME AS Constraint_Name,
            FK.TABLE_SCHEMA AS fkSchema,
            PK.TABLE_SCHEMA AS pkSchema,
            PT.COLUMN_NAME AS primarykey,
            FK.ORDINAL_POSITION
    FROM    INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS C
            INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS FK
                ON FK.CONSTRAINT_CATALOG = C.CONSTRAINT_CATALOG
                AND FK.CONSTRAINT_SCHEMA = C.CONSTRAINT_SCHEMA
                AND FK.CONSTRAINT_NAME = C.CONSTRAINT_NAME
            INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS PK
                ON PK.CONSTRAINT_CATALOG = C.UNIQUE_CONSTRAINT_CATALOG
                AND PK.CONSTRAINT_SCHEMA = C.UNIQUE_CONSTRAINT_SCHEMA
                AND PK.CONSTRAINT_NAME = C.UNIQUE_CONSTRAINT_NAME
                AND PK.ORDINAL_POSITION = FK.ORDINAL_POSITION
            INNER JOIN (
                        SELECT  i1.TABLE_NAME,
                                i2.COLUMN_NAME
                        FROM    INFORMATION_SCHEMA.TABLE_CONSTRAINTS i1
                                INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE i2
                                    ON i1.CONSTRAINT_NAME = i2.CONSTRAINT_NAME
                        WHERE   i1.CONSTRAINT_TYPE = 'PRIMARY KEY'
                    ) PT
                ON PT.TABLE_NAME = PK.TABLE_NAME
    WHERE   PT.COLUMN_NAME = PK.COLUMN_NAME
            and FK.TABLE_NAME in ('${tableNames.join("\',\'")}')
            and PK.TABLE_NAME in ('${tableNames.join("\',\'")}')`;


    return new Promise((res, rej) => {
        var rows = [];

        dbUtils.executeSql(
            config,
            { sql },
            row => rows.push({
                fkTable: row[0].value,
                fkColumn: row[1].value,
                pkTable: row[2].value,
                pkColumn: row[3].value,
                constraintName: row[4].value,
                fkSchema: row[5].value,
                pkSchema: row[6].value,
                primaryKey: row[7].value,
                ordinalPosition: row[8].value
            }),
            rowCount => {
                res(rows);
            },
            error => {
                rej(error);
            });
    });
}

function calcRelationship(fkTable, pkTable, fkCol, pkCol) {
    const fkTableSinglePk = fkTable.primaryKeys.length == 1;
    const pkTableSinglePk = pkTable.primaryKeys.length == 1;

    // TODO: What if its not a single col pk?

    // 1:1
    if (fkCol.primaryKey && pkCol.primaryKey && fkTableSinglePk && pkTableSinglePk)
        return "oneToOne";

    // 1:n
    if (fkCol.primaryKey && !pkCol.primaryKey && fkTableSinglePk)
        return "oneToMany";

    // n:1
    if (!fkCol.primaryKey && pkCol.primaryKey && pkTableSinglePk)
        return "manyToOne";

    // n:n
    return "manyToMany";
}

function processFks(tableInfos, fkInfos) {
    const tables = tableInfos.map(t => {
        t.foreignKeys = [];
        t.reverseNavigations = [];
        return t;
    });

    const cstNames = utils.distinct(fkInfos, i => i.constraintName);

    cstNames.forEach(cstName => {

        const workCsts = fkInfos.filter(i => i.constraintName === cstName);
        const firstCst = workCsts[0];
        const fkTable = tables.find(t => t.name.toUpperCase() === firstCst.fkTable.toUpperCase());
        const pkTable = tables.find(t => t.name.toUpperCase() === firstCst.pkTable.toUpperCase());

        if (!fkTable || !pkTable)
            return;

        const cols = [];
        workCsts.forEach(cst => {
            cols.push({
                fkColumn: fkTable.columns.find(c => c.columnName.toUpperCase() === cst.fkColumn.toUpperCase()),
                pkColumn: pkTable.columns.find(c => c.columnName.toUpperCase() === cst.pkColumn.toUpperCase()),
                ordinal: cst.ordinalPosition
            });
        });

        // skip dupes
        if (fkTable.foreignKeys) {
            const existingFk = fkTable.foreignKeys.find(efk => {

                if (efk.pkTableName.toUpperCase() !== pkTable.name.toUpperCase())
                    return false;
                if (efk.columns.length !== cols.length)
                    return false;
                if (efk.columns.every(efkCol => {
                    return cols.some(col => {
                        return efkCol.fkColumn.columnName.toUpperCase() === col.fkColumn.columnName.toUpperCase()
                            && efkCol.pkColumn.columnName.toUpperCase() === col.pkColumn.columnName.toUpperCase();
                    });
                }))
                    return false;

                return true;
            });

            if (existingFk)
                return;
        }

        const relationship = calcRelationship(fkTable, pkTable, cols[0].fkColumn, cols[0].pkColumn);

        fkTable.foreignKeys.push({
            pkTableName: pkTable.name,
            constraintName: cstName,
            columns: cols,
            relationship: relationship
        });

        pkTable.reverseNavigations.push({
            fkTableName: fkTable.name,
            constraintName: cstName,
            columns: cols,
            relationship: relationship
        });

    });

    return tables;
}


async function tables(config, tableNames) {
    let [t, fk] = await Promise.all([
        tableInfos(config, tableNames), 
        fkInfos(config, tableNames)
    ]);
    return processFks(t, fk);
}



async function table(config, tableName) {
    const tables = await tables(config, [tableName]);
    if (tables.length == 0)
        throw(`Table "${tableName}" does not exist`);
    return tables[0];
};







module.exports = {
    names,
    table,
    tables
};