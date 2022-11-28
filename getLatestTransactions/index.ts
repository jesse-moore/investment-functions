import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { TableClient } from "@azure/data-tables";
import { env } from "process";
import { test } from "../common/test";
import { Token } from "../models/Token";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.fsgfddsfgdfg");
  const connectionString = env.TableStorageConnectionString;
  const client = TableClient.fromConnectionString(connectionString, "authTokens");


  async function main() {
    const authToken = await client.getEntity<Token>("TD_AMERITRADE", "AUTH_TOKEN");
    console.log(authToken.value)
  }

  main();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body:
      "Hello, " +
      test +
      ". This HTTP triggered function executed successfully.",
  };
};

export default httpTrigger;
