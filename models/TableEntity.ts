import { TableEntity as TE } from "@azure/data-tables";

export class TableEntity implements TE {
    [x: string]: unknown;
    partitionKey: string;
    rowKey: string;
}