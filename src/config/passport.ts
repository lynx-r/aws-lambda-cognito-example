import {LocalStrategy} from "./passport/local";
import {JwtStrategy} from "./passport/jwt";
import {UserService} from "../service/user.service";

export = function (jwtStrategy: JwtStrategy, localStrategy: LocalStrategy): [any] {
  let local = localStrategy.getStrategy();
  // jwtStrategy.setupJwtStrategy(passport);
  return [local];
};
