import {Strategy} from "passport-local";
import {inject} from "inversify";
import {TYPES} from "../../constant/types";
import {UserService} from "../../service/user.service";
import {provide} from "../../ioc/ioc";
import {Passport} from "passport";

@provide(TYPES.LocalStrategy)
export class LocalStrategy {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  getStrategy() {
    return new Strategy({
      usernameField: 'email'
    },function(email, password, done) {
      this.userService.findOne({email}, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user || !user.checkPassword(password)) {
          return done(null, false, {message: 'Invalid login credentials'});
        }
        return done(null, user);
      })
    });
  }

}