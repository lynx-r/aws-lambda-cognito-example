import * as db from "dynongo";

export class DynongoService {

  constructor() {
    db.connect({
      local: true,
      prefix: 'sb-dev'
    })
  }
}