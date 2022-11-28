import { TableClient, TableServiceClientOptions } from "@azure/data-tables";
import { env } from "process";

const connectionString = env.TableStorageConnectionString;

export const initTableClient = (table: string, options?: TableServiceClientOptions) => {
  return TableClient.fromConnectionString(connectionString, table, options);
};
