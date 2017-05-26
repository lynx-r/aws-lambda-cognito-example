import {LocalStrategy} from "./passport/local";
import {JwtStrategy} from "./passport/jwt";
import {UserService} from "../service/user.service";
import {container} from "../ioc/ioc";
import {CognitoStrategy} from "./passport/cognito";
import {TYPES} from "../constant/types";

export = function (): [any] {
  const cognitoStrategy = container.get<CognitoStrategy>(TYPES.CognitoStrategy);
  // let local = localStrategy.getStrategy();
  let cognito = cognitoStrategy.getStrategy();
  // jwtStrategy.setupJwtStrategy(passport);
  return [cognito];
};
