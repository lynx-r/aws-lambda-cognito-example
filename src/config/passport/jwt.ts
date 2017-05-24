import {ExtractJwt, Strategy} from "passport-jwt";
import {nconf} from "../config";
import {inject} from "inversify";
import {TYPES} from "../../constant/types";
import {UserService} from "../../service/user.service";
import {Passport} from "passport";
import {provide} from "../../ioc/ioc";

@provide(TYPES.JwtStrategy)
export class JwtStrategy {

  private passport = new Passport();

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  setupJwtStrategy() {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: nconf.get('jwtSecret')
    };

    this.passport.use(new Strategy(jwtOptions, (payload, done) => {
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