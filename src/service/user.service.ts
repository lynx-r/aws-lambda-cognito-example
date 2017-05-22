import {inject, injectable} from "inversify";
import {UserRepository} from "../dao/user-repository";
import {TYPES} from "../di/types.const";

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
}
