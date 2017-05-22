// /*
//  * Module dependencies.
//  */
//
// import {setupLocalStrategies} from "./passport/local";
// import {UserService} from "../service/user.service";
// import {IUser} from "../model/user";
//
// /**
//  * Expose
//  */
//
// export = function (passport) {
//
//   // ====================== //
//   // passport session setup //
//   // ====================== //
//   // required for persistent login sessions
//   // passport needs ability to serialize and unserialize users out of session
//
//   // used to serialize the user for the session
//   passport.serializeUser(function(user: IUser, done) {
//     done(null, user._id);
//   });
//
//   // used to deserialize the user
//   passport.deserializeUser(function(id, done) {
//     UserService.INSTANCE.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
//
//   setupLocalStrategies(passport);
// };
