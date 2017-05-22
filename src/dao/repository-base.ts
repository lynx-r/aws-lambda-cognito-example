import * as mongoose from "mongoose";
import {injectable, unmanaged} from "inversify";

export interface IRead<T> {
  retrieve: (callback: (error: any, result: any) => void) => void;
  findById: (id: string, callback: (error: any, result: T) => void) => void;
  findOne(cond?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T>;
  find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]>;
}

export interface IWrite<T> {
  create: (item: T, callback: (error: any, result: any) => void) => void;
  update: (_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
  delete: (_id: string, callback: (error: any, result: any) => void) => void;
}

@injectable()
export class RepositoryBase<T extends mongoose.Document> implements IRead<T>, IWrite<T> {

  private _model: mongoose.Model<mongoose.Document>;

  constructor(@unmanaged() schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  create(item: T, callback: (error: any, result: T) => void) {
    this._model.create(item, callback);
  }

  insertMany(items: Array<T>, callback: (error: any, result:T)=>void){
    this._model.insertMany(items, callback);
  }

  retrieve(callback: (error: any, result: T) => void) {
    this._model.find({}, callback);
  }

  update(_id: mongoose.Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
    this._model.update({_id: _id}, item, callback);
  }

  delete(_id: string, callback: (error: any, result: any) => void) {
    this._model.remove({_id: this.toObjectId(_id)}, (err) => callback(err, null));
  }

  findById(_id: string, callback: (error: any, result: T) => void) {
    this._model.findById(_id, callback);
  }

  findOne(cond?: Object, projection?: Object, callback?: (err: any, res: T) => void): mongoose.Query<T> {
    return this._model.findOne(cond, projection, callback);
  }

  find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): mongoose.Query<T[]> {
    return this._model.find(cond, options, callback);
  }

  private toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }

}