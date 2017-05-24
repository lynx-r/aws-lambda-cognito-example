import 'reflect-metadata';
import {Container, inject, interfaces} from 'inversify';
import {autoProvide, makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {makeLoggerMiddleware} from 'inversify-logger-middleware';
import {UserController} from "../controller/user.controller";

let container = new Container();

if (process.env.NODE_ENV === 'development') {
  // let logger = makeLoggerMiddleware();
  // container.applyMiddleware(logger);
}

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideSingleton = function(identifier) {
  return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

let provideNamed = function (identifier, name) {
  return fluentProvider(identifier)
    .inSingletonScope()
    .whenTargetNamed(name)
    .done();
};

let bindDependencies = function (func, dependencies) {
  let injections = dependencies.map((dependency) => {
    return container.get(dependency);
  });
  return func.bind(func, ...injections);
};

let bindDependenciesWithUnused = function (func, args, dependencies) {
  let injections = dependencies.map((dependency) => {
    return container.get(dependency);
  });
  return func.bind(func, ...args, ...injections);
};

export {container, autoProvide, provide, provideNamed, provideSingleton,
  inject, bindDependencies, bindDependenciesWithUnused};
