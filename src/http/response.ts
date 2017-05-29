import {log} from "util";

export class Response {
  ok: boolean;
  comment: string;
  data: any;

  constructor(ok: boolean, comment: string, data?: any) {
    this.ok = ok;
    this.comment = comment;
    this.data = data;
    log(comment);
  }
}