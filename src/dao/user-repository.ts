import {RepositoryBase} from "./repository-base";
import {IUser, UserModel} from "../model/User";

export class UserRepository extends RepositoryBase<IUser> {
  constructor() {
    super(UserModel);
  }
}

Object.seal(UserRepository);