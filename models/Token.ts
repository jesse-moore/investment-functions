import { TableEntity } from "./TableEntity";

export class Token extends TableEntity {
  value: string;
  expireTime: number;
}
