import * as _ from 'lodash';
import {log} from "util";

export class Utils {
  static parseJson(str: string): any {
    return _.attempt(JSON.parse.bind(null, str));
  }

  // static async<T>(makeGenerator: (done: boolean, value: T) => IterableIterator<{ done: boolean, value: T }>): () => Promise<T> {
  //   return () => {
  //     let generator = makeGenerator.apply(this, arguments);
  //
  //     function handle(result) {
  //       // result => { done: [Boolean], value: [Object] }
  //       if (result.done) {
  //         return Promise.resolve(result.value);
  //       }
  //
  //       return Promise.resolve(result.data).then((res) => {
  //         return handle(generator.next(res));
  //       }, function (err) {
  //         return handle(generator.throw(err));
  //       });
  //     }
  //
  //     try {
  //       return handle(generator.next());
  //     } catch (e) {
  //       return Promise.reject(e);
  //     }
  //   };
  // }
  static respond(res: any, tpl: string, obj: any, status: number) {

  }
}