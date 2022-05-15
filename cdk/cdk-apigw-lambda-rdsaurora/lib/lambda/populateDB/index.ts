import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RDSData } from "../rds-data/rds-data";
import RDSDatabase from "../rds-data/rds-database";
import { rawdata } from "./visits";

export const handleApiRequest = async (
  event?: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const params = {
    region: "eu-central-1",
    secretArn: process.env.secretArn || "",
    resourceArn: process.env.dbClusterArn || "",
    database: "cloudxs_mydatabase",
  };

  const db = new RDSDatabase(params).getInstance();

  await db.query("DELETE FROM visits");

  console.log("Limit: ", Number(process.env.limit));
  const dataset = rawdata.slice(0, Number(process.env.limit));
  let count = 0;
  const chunkSize = 100;
  for (let i = 0; i < dataset.length; i += chunkSize) {
    const chunk = dataset.slice(i, i + chunkSize);
    count = await insertBatch(chunk, db, count);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "command completed successfully",
      result: "${number} rows imported",
      event: event,
    }),
  };
};

async function insert(
  dataset: (string | number)[][],
  db: RDSData,
  count: number
): Promise<number> {
  console.log("Begin transaction");
  await db.transaction().then(async (transactionId) => {
    console.log("Inserting " + count);
    for (const row of dataset) {
      await db.query(
        "INSERT INTO visits (url, date, likelyvisits, rawvisits) VALUES (:url, :date, :likelyvisits, :rawvisits)",
        {
          url: row[0],
          date: row[1],
          likelyvisits: row[2],
          rawvisits: row[3],
        },
        transactionId
      );
      count++;
    }
    await db.commit(transactionId);
  });
  return count;
}

async function insertBatch(
  dataset: (string | number)[][],
  db: RDSData,
  count: number
): Promise<number> {
  await db.transaction().then(async (transactionId) => {
    console.log("Inserting Batch " + count);
    const rows = dataset.map((row) => ({
      url: row[0],
      date: row[1],
      likelyvisits: row[2],
      rawvisits: row[3],
    }));

    count++;

    await db.queryBatch(
      "INSERT INTO visits (url, date, likelyvisits, rawvisits) VALUES (:url, :date, :likelyvisits, :rawvisits)",
      rows,
      transactionId
    );
    await db.commit(transactionId);
  });
  return count;
}
