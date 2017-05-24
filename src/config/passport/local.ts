import {Strategy} from "passport-local";
import {inject} from "inversify";
import {TYPES} from "../../constant/types";
import {UserService} from "../../service/user.service";
import {provide} from "../../ioc/ioc";

@provide(TYPES.LocalStrategy)
export class LocalStrategy {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  setupLocalStrategy(passport) {
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
      }, (email, password, done) => {
        this.userService.findOne({email}, (err, user) => {
          if (err) {
            return done(err);
          }

          if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Invalid login credentials'});
          }
          return done(null, user);
        })
      })
    );
  }

}