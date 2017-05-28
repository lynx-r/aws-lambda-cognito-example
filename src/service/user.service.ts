import {inject} from "inversify";
import {UserRepository} from "../dao/user-repository";
import {TYPES} from "../constant/types";
import {provideSingleton} from "../ioc/ioc";
import CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
import {nconf} from "../config/config";

@provideSingleton(TYPES.UserService)
export class UserService {

  constructor(@inject(TYPES.UserRepository) private repo: UserRepository) {
  }

  register(given_name: string, email: string, password: string,
           callback: (error, response) => any) {
    const params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: email,
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

  confirmRegistration(email, confirmationCode: any, callback: (err, user) => any) {
    const params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: email,
      ConfirmationCode: confirmationCode
    };
    console.log(params);

    const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoidentityserviceprovider.confirmSignUp(params, callback);
  }

  resendCode(email: string, callback: (err, user) => any): void {
    let params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: email
    };

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.resendConfirmationCode(params, callback);
  }

  authenticate(email: string, password: string, callback: (error, user) => any) {
    let params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      UserPoolId: nconf.get('aws:cognito:user_pool_id'),
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };
    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.adminInitiateAuth(params, callback);
  }

  forgotPassword(email: string, callback: (err, user) => any): void {
    let params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: email
    };

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.forgotPassword(params, callback);
  }


  confirmNewPassword(email: string, confirmationCode: string, password: string, callback: (error, result)=>any) {
    let params = {
      ClientId: nconf.get('aws:cognito:user_pool_client_id'),
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password
    };

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.confirmForgotPassword(params, callback);
  }

  logout(email: string, callback: (error, result) => any) {
    let params = {
      UserPoolId: nconf.get('aws:cognito:user_pool_id'),
      Username: email
    };

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(UserService.getAWSRegion());
    cognitoIdentityServiceProvider.adminUserGlobalSignOut(params, callback);
  }

  private static getAWSRegion() {
    return {region: nconf.get('aws:region')};
  }
}
