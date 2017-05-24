import {ExtractJwt, Strategy} from "passport-jwt";
import {nconf} from "../config";
import {inject} from "inversify";
import {TYPES} from "../../constant/types";
import {UserService} from "../../service/user.service";
import {provide} from "../../ioc/ioc";

@provide(TYPES.JwtStrategy)
export class JwtStrategy {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  setupJwtStrategy(passport) {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: nconf.get('jwtSecret')
    };

    passport.use(new Strategy(jwtOptions, (payload, done) => {
        this.userService.findById(payload.id, (err, user) => {
          if (err) {
            return done(err)
          }
          if (user) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
      })
    );
  }
}