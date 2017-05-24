import {log} from "util";

export class Response {
  ok: boolean;
  comment: string;
  data: any;
  jsonString?: string;

  constructor(ok: boolean, comment: string, data?: any) {
    this.ok = ok;
    this.comment = comment;
    this.data = data;
    this.jsonString = JSON.stringify(data);
    log(comment);
  }
}