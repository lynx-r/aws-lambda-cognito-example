import events = require('events');
import * as mongoose from 'mongoose';
import {AppConstants} from "./app-constants";
import {injectable} from "inversify";

@injectable()
export class MongoService {

  constructor() {
  }

  connect() {
    let uri = AppConstants.DB_URL;
    mongoose.connect(uri, (err) => {
      if (err) {
        console.log(err.message);
        console.log(err);
      }
      else {
        console.log('Connected to MongoDb');
      }
    });
  }
}