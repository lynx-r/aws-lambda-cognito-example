'use strict';

/**
 * Module dependencies.
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
  name: string,
  email: string,
  hashed_password?: string,
  salt?: string,
  authToken?: string,
  facebook?: any,
  twitter?: any,
  google?: any,
  vk?: any
}

/**
 * User Schema
 */

const UserSchema = new Schema({
  name: {type: String, default: ''},
  email: {type: String, default: '', unique: true},
  provider: {type: String, default: ''},
  hashed_password: {type: String, default: ''},
  authToken: {type: String, default: ''},
  facebook: {},
  twitter: {},
  google: {},
  vk: {}
}, {
  timestamps: true
});

const validatePresenceOf = (value: string) => {
  value && value.length;
};

/**
 * Virtuals
 */

// UserSchema
//   .virtual('password')
//   .set(function (password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate((name: string) => {
  if (this.skipValidation()) return true;
  return name.length;
}, 'Name cannot be blank');

// UserSchema.path('email').validate(function (email) {
//   if (this.skipValidation()) return true;
//   return email.length;
// }, 'Email cannot be blank');

// UserSchema.path('email').validate(function (email, fn) {
//   const User = mongoose.model('user');
//   if (this.skipValidation()) fn(true);
//
//   Check only when it is a new user or when email field is modified
// if (this.isNew || this.isModified('email')) {
//   User.find({email: email}).exec(function (err, users) {
//     fn(!err && users.length === 0);
//   });
// } else fn(true);
// }, 'Email already exists');

// UserSchema.plugin(mongooseUniqueValidator);

// UserSchema.path('username').validate(function (username) {
//   if (this.skipValidation()) return true;
//   return username.length;
// }, 'Username cannot be blank');

// UserSchema.path('hashed_password').validate(function (hashed_password) {
//   if (this.skipValidation()) return true;
//   return hashed_password.length && this._password.length;
// }, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.hashed_password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

export let UserModel = mongoose.model<IUser>('user', UserSchema, 'users', true);
