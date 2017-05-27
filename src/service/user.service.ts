import {inject} from "inversify";
import {UserRepository} from "../dao/user-repository";
import {TYPES} from "../constant/types";
import {IUser} from "../model/user";
import {provideSingleton} from "../ioc/ioc";
import * as passport from "passport";
import CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
import {nconf} from "../config/config";

@provideSingleton(TYPES.UserService)
export class UserService {

  passport: passport.Passport = new passport.Passport();

  constructor(@inject(TYPES.UserRepository) private repo: UserRepository) {
  }

  findOne(param: object, callback: (err, user) => any) {
    this.repo.findOne(param, callback);
  }

  findById(id, callback: (err, user) => any) {
    this.repo.findById(id, callback);
  }

  signup(email, password, displayName, callback) {
    const params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: displayName,
      Password: password,
      UserAttributes: [
        {Name: "email", Value: email}
      ]
    };
    console.log(params);

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({region: nconf.get('aws:region')});
    cognitoidentityserviceprovider.signUp(params, callback);
  }

  login(email, password, callback) {
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      UserPoolId: nconf.get('aws:cognito:user_pool_id'),
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    console.log(params);

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({region: nconf.get('aws:region')});
    cognitoidentityserviceprovider.adminInitiateAuth(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
      }
    });
  }

  safeUser(user: IUser) {
    return <IUser>{
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
    };
  }

}
