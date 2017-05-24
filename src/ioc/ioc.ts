import 'reflect-metadata';
import {Container, inject} from 'inversify';
import {autoProvide, makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {makeLoggerMiddleware} from 'inversify-logger-middleware';

let container = new Container();

if (process.env.NODE_ENV === 'development') {
  let logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideNamed = function (identifier, name) {
  return fluentProvider(identifier)
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

export {container, autoProvide, provide, provideNamed, inject, bindDependencies};
