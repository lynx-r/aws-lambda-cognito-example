import {RepositoryBase} from "./repository-base";
import {IUser, UserModel} from "../model/User";
import {provide} from "../ioc/ioc";
import {TYPES} from "../constant/types";

@provide(TYPES.UserRepository)
export class UserRepository extends RepositoryBase<IUser> {
  constructor() {
    super(UserModel);
  }
}

Object.seal(UserRepository);