import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

export const handleApiRequest = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let rdsData = new AWS.RDSDataService();
  const tables = await executeSelect(
    rdsData,
    "select count(*) from pg_tables where tablename='visits'"
  );
  if (tables[0][0] === 1) {
    const result = await executeSelect(rdsData, "select * from visits");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "command completed successfully",
        result: result,
        event: event,
      }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "Create the database first",
      event: event,
    }),
  };
};

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
  console.log(sql);

  const result = await rdsData.executeStatement(sqlParams).promise();
  return result.records;
}


