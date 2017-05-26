import {Strategy} from "passport-cognito";
import {inject} from "inversify";
import {TYPES} from "../../constant/types";
import {UserService} from "../../service/user.service";
import {provideSingleton} from "../../ioc/ioc";
import {Passport} from "passport";
import {nconf} from "../config";

@provideSingleton(TYPES.CognitoStrategy)
export class CognitoStrategy {

  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  getStrategy() {
    return new Strategy({
      userPoolId: nconf.get('aws:cognito:user_pool_id'),
      clientId: nconf.get('aws:client_id'),
      region: nconf.get('aws:region'),
      usernameField: nconf.get('passport:username_field')
    }, (accessToken, idToken, refreshToken, user, cb) => {
      console.log(`accessToken: ${accessToken}, idToken: ${idToken}, refreshToken: ${refreshToken}, user: ${user}`)
      cb(null, user);
      // this.userService.findOne({email}, (err, user) => {
      //   if (err) {
      //     return done(err);
      //   }
      //
      //   console.log(user);
      //
      //   if (!user || !user.checkPassword(password)) {
      //     return done(null, false, {message: 'Invalid login credentials'});
      //   }
      //   return done(null, user);
      // })
    });
  }

}