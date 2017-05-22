// import {Passport} from "passport";
// import {IUser} from "../../model/user";
// import {UserService} from "../../service/user.service";
//
// let LocalStrategy = require('passport-local').Strategy;
//
// export function setupLocalStrategies(passport: Passport): void {
//
//   // ============ //
//   // LOCAL SIGNUP //
//   // ============ //
//
//   passport.use('local-signup', new LocalStrategy({
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true
//     },
//     function (req, email, password, done) {
//       // async
//       process.nextTick(function () {
//
//         // first we try to find the user to see if already exists
//         // UserService.INSTANCE.findOne({'email': email}, 'name email', function (err, user) {
//         //   // if error, return error
//         //   if (err) {
//         //     return done(err);
//         //   }
//         //
//         //   // check if the email already exists
//         //   if (user) {
//         //     done(null, false, 'User exists');
//         //   } else {
//             // saving the user
//             UserService.INSTANCE.createUser(req.body.name, email, password).then((user) => {
//               done(null, user);
//             })
//           // }
//         // });
//       });
//     })
//   );
//
//   // =========== //
//   // LOCAL LOGIN //
//   // =========== //
//   // We create another strategy for the login process
//
//   passport.use('local-login', new LocalStrategy({
//       // change default username for email
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true // allows us to pass back the entire request to the callback
//     },
//     function (req, email, password, done) {
//       // first check if the user already exists
//       UserService.INSTANCE.findOne({'email': email}, 'name email hashed_password salt', function (err, user: IUser) {
//         // If there are any error, return the error
//         if (err) {
//           return done(err);
//         }
//
//         // if no user is found, return message
//         if (!user) {
//           return done(null, false, 'No user found.');
//         }
//
//         // if the user exists, we check the password
//         if (!UserService.INSTANCE.authenticate(password, user.hashed_password)) {
//           return done(null, false, 'No user found.');
//         }
//
//         // if everything is ok, return the user
//         return done(null, UserService.INSTANCE.safeUser(user));
//       });
//     })
//   );
//
// };