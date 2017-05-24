import * as passport from "passport";
import {provide} from "../ioc/ioc";
import {TYPES} from "../constant/types";

@provide(TYPES.PassportService)
export class PassportService {

  private _passport: number;

  constructor() {
    this._passport = 0;
  }

  get passport(): number {
    return this._passport;
  }

  set passport(passport) {
    this._passport = passport;
  }

}