
import {container} from "../di/inversify.config";
import {TYPES} from "../di/types.const";
import {LocalStrategy} from "./passport/local";
import {JwtStrategy} from "./passport/jwt";

export = function (passport) {
  const localStrategy = container.get<LocalStrategy>(TYPES.LocalStrategy);
  localStrategy.setupLocalStrategy(passport);
  const jwtStrategy = container.get<JwtStrategy>(TYPES.JwtStrategy);
  jwtStrategy.setupJwtStrategy(passport);
};
