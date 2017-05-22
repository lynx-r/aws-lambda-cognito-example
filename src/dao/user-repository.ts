import {RepositoryBase} from "./repository-base";
import {IUser, UserModel} from "../model/User";
import {injectable} from "inversify";

@injectable()
export class UserRepository extends RepositoryBase<IUser> {
  constructor() {
    super(UserModel);
  }
}

Object.seal(UserRepository);