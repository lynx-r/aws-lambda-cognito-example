import {Strategy} from "passport-local";
import {inject, injectable} from "inversify";
import {TYPES} from "../../di/types.const";
import {UserService} from "../../service/user.service";

@injectable()
export class LocalStrategy {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  setupLocalStrategy(passport) {
    passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {
        this.userService.findOne({email}, (err, user) => {
          if (err) {
            return done(err);
          }

          if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
          }
          return done(null, user);
        })
      })
    );
  }


}