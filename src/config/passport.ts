import {LocalStrategy} from "./passport/local";
import {JwtStrategy} from "./passport/jwt";
import * as passport from "passport";

export = function (jwtStrategy: JwtStrategy, localStrategy: LocalStrategy) {
  localStrategy.setupLocalStrategy(passport);
  jwtStrategy.setupJwtStrategy(passport);
};
