import events = require('events');
import * as mongoose from 'mongoose';

export class MongoService {

  constructor() {
  }

  connect() {
    let uri = 'mongodb://localhost/shashki';
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