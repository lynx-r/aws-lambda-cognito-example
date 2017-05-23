import {inject, injectable} from "inversify";
import {UserRepository} from "../dao/user-repository";
import {TYPES} from "../di/types.const";
import {IUser} from "../model/user";

@injectable()
export class UserService {

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
      displayName: user.displayName,
      email: user.email,
    };
  }

}
