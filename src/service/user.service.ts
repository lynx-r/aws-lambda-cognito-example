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

  register(given_name: string, username: string, email: string, password: string,
           callback: (error, response) => any) {
    const params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: username,
      Password: password,
      UserAttributes: [
        {Name: "email", Value: email},
        {Name: "given_name", Value: given_name}
      ]
    };
    console.log(params);

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoidentityserviceprovider.signUp(params, callback);
  }

  login(displayName, email, password, callback) {
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

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoidentityserviceprovider.adminInitiateAuth(params, function (err, data) {
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

  confirmRegistration(username, confirmationCode: any, callback: (err, user) => any) {
    const params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: username,
      ConfirmationCode: confirmationCode
    };
    console.log(params);

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoidentityserviceprovider.confirmSignUp(params, callback);
  }

  resendCode(username: string, callback: (err, user) => any): void {
    let params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: username
    };

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.resendConfirmationCode(params, callback);
  }

  private static getAWSRegion() {
    return {region: nconf.get('aws:region')};
  }

  authenticate(username: string, password: string, callback: (error, user) => any) {
    let params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      UserPoolId: nconf.get('aws:cognito:user_pool_id'),
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };
    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.adminInitiateAuth(params, callback);
  }

}
