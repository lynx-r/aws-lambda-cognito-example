import {UserRepository} from "../dao/user-repository";
import {IUser} from "../model/user";
import * as bcrypt from "bcryptjs";

export class UserService {

  static INSTANCE: UserService = new UserService();

  createUser(name: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
      const repo = new UserRepository();
      const user = <IUser>{
        name: name,
        email: email,
        hashed_password: this.encryptPassword(password, 7)
      };
      repo.create(user, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      })
    })
  }

  makeSalt() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param salt
   * @return {String}
   * @api public
   */

  encryptPassword(password, salt) {
    if (!password) return '';
    try {
      return bcrypt.hashSync(password, salt);
    } catch (err) {
      return '';
    }
  }

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @param user_hashed_password
   * @return {Boolean}
   * @api public
   */
  authenticate(plainText: string, user_hashed_password: string) {
    return bcrypt.compareSync(plainText, user_hashed_password);
  }

  findById(_id: any, done: (err, user) => any) {
    const repo = new UserRepository();
    repo.findById(_id, done);
  }

  findOne(param: { email: any }, projection: Object, done: (err, user) => any) {
    const repo = new UserRepository();
    repo.findOne(param, projection, done);
  }

  safeUser(user: IUser) {
    return <IUser>{
      name: user.name,
      email: user.email,
    };
  }
}