// import {Router} from "express";
// import * as passport from "passport";
// import {BaseRoute} from "./route";
// import {Response} from "../model/response";
// import * as jwt from "jsonwebtoken";
// import {AppConstants} from "../service/app-constants";
//
// export class PassportRoute extends BaseRoute {
//
//   static INSTANCE: PassportRoute = new PassportRoute();
//
//   private fail = {
//     failureRedirect: '/login'
//   };
//
//   login(req, resp, next) {
//     passport.authenticate('local-login', (err, resp, msg) => {
//       if (!resp) {
//         super.send(req, resp, new Response(false, msg), next, 401);
//       } else {
//         const jwt =
//         super.send(req, resp, new Response(true, 'User signed up', resp), next, 200);
//       }
//     })(req, resp, next);
//   }
//
//   signup(req, resp, next) {
//     passport.authenticate('local-signup', (err, resp, msg) => {
//       if (!resp) {
//         super.send(req, resp, new Response(false, msg), next, 500);
//       } else {
//         const token = jwt.sign({
//           user: resp
//         }, AppConstants.JWT_SECRET
//         , {expiresIn: AppConstants.TOKEN_EXPIRES});
//         const response = {
//           token: token,
//           userId: resp._id
//         };
//         super.send(req, resp, new Response(true, 'User signed up', response), next, 200);
//       }
//     })(req, resp, next);
//   }
//
//   signin(req, resp, next) {
//
//   }
//
//   logout(req, resp, next) {
//     req.logOut();
//     super.send(req, resp, new Response(true, 'User has logged out'), next);
//   }
//
//   show(req, resp, next) {
//
//   }
//
//   authCallback(req, resp, next) {
//
//   }
//
//   load(req, resp, next) {
//
//   }
//
//   create(router: Router) {
//     // const pauth = passport.authenticate.bind(passport);
//
//     // user routes
//     // router.get('/login', this.login);
//     router.post('/login', this.login);
//     router.post('/signup', this.signup);
//     router.get('/logout', this.logout);
//     // router.get('/logout', this.logout);
//     // router.post('/users', this.createUser);
//     /*
//      router.post('/users/session',
//      pauth('local', {
//      failureRedirect: '/login',
//      failureFlash: 'Invalid email or password.'
//      }), this.session);
//      router.get('/users/:userId', this.show);
//      router.get('/auth/facebook',
//      pauth('facebook', {
//      scope: ['email', 'user_about_me'],
//      failureRedirect: '/login'
//      }), this.signin);
//      router.get('/auth/facebook/callback', pauth('facebook', this.fail), this.authCallback);
//      // server.get('/auth/github', pauth('github', fail), users.signin);
//      // server.get('/auth/github/callback', pauth('github', fail), users.authCallback);
//      router.get('/auth/twitter', pauth('twitter', this.fail), this.signin);
//      router.get('/auth/twitter/callback', pauth('twitter', this.fail), this.authCallback);
//      router.get('/auth/google',
//      pauth('google', {
//      failureRedirect: '/login',
//      scope: [
//      'https://www.googleapis.com/auth/userinfo.profile',
//      'https://www.googleapis.com/auth/userinfo.email'
//      ]
//      }), this.signin);
//      router.get('/auth/google/callback', pauth('google', this.fail), this.authCallback);
//      // server.get('/auth/linkedin',
//      //   pauth('linkedin', {
//      //     failureRedirect: '/login',
//      //     scope: [
//      //       'r_emailaddress'
//      //     ]
//      //   }), users.signin);
//      // server.get('/auth/linkedin/callback', pauth('linkedin', fail), users.authCallback);
//      */
//
//     router.param('userId', this.load);
//   }
// }
