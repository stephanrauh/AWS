import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

export const handleApiRequest = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    let rdsData = new AWS.RDSDataService();
    const tables = await executeSelect(
      rdsData,
      "select count(*) from pg_tables where tablename='visits'"
    );

    if (tables[0][0] === 0) {
      const rdsData = new AWS.RDSDataService();
      const sql = `CREATE TABLE visits (
        id SERIAL PRIMARY KEY ,
        url varchar(120) DEFAULT NULL,
        date char(10) DEFAULT NULL,
        likelyvisits integer DEFAULT NULL,
        rawvisits integer DEFAULT NULL,
        lastaccess timestamp NOT NULL DEFAULT current_timestamp
      );`;
      await executeSql(rdsData, sql);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "successfully created the database",
          event: event,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "database is already there",
          event: event,
        }),
      };
    }
  } catch (exception) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "couldn't create the database",
        exception,
        event: event,
      }),
    };
  }
};

async function readTable() {
  const sqlParams = {
    secretArn: process.env.secretArn,
    resourceArn: process.env.dbClusterArn,
    sql: "select * from visits;",
    database: "cloudxs_mydatabase",
    includeResultMetadata: true,
  } as AWS.RDSDataService.ExecuteStatementRequest;

  const rdsData = new AWS.RDSDataService();
  const result = await rdsData
    .executeStatement(sqlParams, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    })
    .promise();
  return result;
}

async function executeSql(
  rdsData: AWS.RDSDataService,
  sql: string
): Promise<AWS.RDSDataService.SqlRecords | undefined> {
  const sqlParams = {
    secretArn: process.env.secretArn,
    resourceArn: process.env.dbClusterArn,
    sql,
    database: "cloudxs_mydatabase",
    includeResultMetadata: false,
  } as AWS.RDSDataService.ExecuteStatementRequest;

  const result = await rdsData.executeStatement(sqlParams).promise();
  return result.records;
}

async function executeSelect(
  rdsData: AWS.RDSDataService,
  sql: string
): Promise<Array<Array<any>>> {
  const records = await executeSql(rdsData, sql);
  if (records) {
    return records.map((row) => row.map((column) => Object.values(column)[0]));
  }
  return [];
}
