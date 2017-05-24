import {inject} from "inversify";
import {UserRepository} from "../dao/user-repository";
import {TYPES} from "../constant/types";
import {IUser} from "../model/user";
import {provideSingleton} from "../ioc/ioc";
import * as passport from "passport";

@provideSingleton(TYPES.UserService)
export class UserService {

  passport: passport.Passport = new passport.Passport();

  constructor(@inject(TYPES.UserRepository) private repo: UserRepository) {
  }

  findOne(param: object, callback: (err, user) => any) {
    this.repo.findOne(param, callback);
  }

  findById(id, callback: (err, user) => any) {
    this.repo.findById(id, callback);
  }

  createUser(user: IUser, callback) {
    console.log(user);
    this.repo.create(user, (err, user) => {
      // remove password hash from response
      callback(err, this.safeUser(user));
    })
  }

  safeUser(user: IUser) {
    return <IUser>{
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
    };
  }

}
