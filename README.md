Проект компилировать в JavaScript будем средствами Intellij Idea. Для этого создадим tsconfig.json
```{
  "compileOnSave": true, // обязательно
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "src",
    "sourceMap": true,
    "inlineSources": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "noImplicitAny": false,
    "target": "es6",
    "typeRoots": [
      "node_modules/@types"
    ],
    "types": [
      "reflect-metadata"
    ],
    "module": "commonjs",
    "lib": [
      "es2017",
      "dom"
    ]
  }
}
```

И включим компилятор в настройках:

![Настройки компилятора](https://monosnap.com/file/xcOIklg078fiN22lUTXG9aPqIhP6R0.png)

Далее, добавим задачу компиляции TypeScript при запуске сервера:

![Компиляция TypeScript](https://monosnap.com/file/cbi6Qfa2tZQMD4Bqer4Dy7jo7TriKh.png)

Структура проекта:

```
.
├── README.md
├── bin
│   └── www // точка входа для локального сервера
├── package.json
├── serverless.yml // конфигурация Serverless Framework 
├── src
│   ├── config
│   │   ├── config.json // конфигурация локального проекта
│   │   └── config.ts
│   ├── constant
│   │   ├── app-constants.ts
│   │   ├── tags.ts
│   │   └── types.ts
│   ├── controller // контроллера из inversify-restify-utils 
│   │   ├── article.controller.ts
│   │   ├── home.controller.ts
│   │   └── user.controller.ts
│   ├── http
│   │   └── response.ts
│   ├── ioc // inversify
│   │   ├── ioc.ts
│   │   └── loader.ts
│   ├── lambda.ts // точка входа для AWS Lambda
│   ├── server-base.ts // базовый класс сервера
│   ├── server-lambda.ts // наследуемый от базового класс для лямбд
│   ├── server-local.ts // наследуемый класс от базового для локального сервера
│   └── service
│       ├── article.service.ts
│       └── user.service.ts
└── tsconfig.json
```

Далее, создадим watcher для `config.json`. Он будет наблюдать за изменениями этого файла и 
копировать его в `dist/config`

![Watch config.json](https://monosnap.com/file/o53FGrPJosi2IaOhDQIAea887n2vJi.png)

Настроим Inversion of Control. Для этого создадим файл `ioc.ts`:

```typescript
import 'reflect-metadata'; // не забудьте импортировать эту библиотеку!
import {Container, inject, interfaces} from 'inversify';
import {autoProvide, makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {makeLoggerMiddleware} from 'inversify-logger-middleware';

let container = new Container();

if (process.env.NODE_ENV === 'development') { // для логирования инъекций
  // let logger = makeLoggerMiddleware();
  // container.applyMiddleware(logger);
}

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideSingleton = function(identifier) { // будем предоставлять Singleton вместо Transient по умолчанию
  return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

let provideNamed = function (identifier, name) { // предоставлять по имени как Transient
  return fluentProvider(identifier)
    .inSingletonScope()
    .whenTargetNamed(name)
    .done();
};

let bindDependencies = function (func, dependencies) { // для инъекций в функции. Например func = bindDependencies(myFunc, [TYPES.MyService]); func();
  let injections = dependencies.map((dependency) => {
    return container.get(dependency);
  });
  return func.bind(func, ...injections);
};

let bindDependenciesWithUnused = function (func, args, dependencies) { // то же самое что и выше, но только не с внедряемыми зависимостями 
  let injections = dependencies.map((dependency) => {
    return container.get(dependency);
  });
  return func.bind(func, ...args, ...injections);
};

export {container, autoProvide, provide, provideNamed, provideSingleton,
  inject, bindDependencies, bindDependenciesWithUnused};
```

Перечислим все внедряемые сервисы в `loader.ts`:

```typescript
import '../controller/home.controller';
import '../controller/user.controller';
import '../controller/article.controller';
import '../service/user.service';
import '../service/article.service';
```

Теперь приступим к написанию сервера:

```typescript
// configure cors
app.use(restify.CORS({
  origins: nconf.get("server:origins"),   // defaults to ['*']
  credentials: false,                 // defaults to false
}));

// to get query params in req.query
app.use(restify.acceptParser(app.acceptable));
// to get passed json in req.body
app.use(restify.bodyParser());

// error handler
app.on('error', (error) => {
  this.onError(error);
});
// process exceptions
app.on('uncaughtException', function (request, response, route, error) {
  console.error(error.stack);
  response.send(error);
});
// audit logger
app.on('after', restify.auditLogger({
  log: this.logger
}));

app.use(helmet());
```

Создадим контроллер `UserController`:

```typescript
@Controller('/users') // аннотация из inversify-restify-utils
@provideNamed(TYPE.Controller, TAGS.UserController) // объявленный ранее маркер позволяющий делять инъекции в этот контроллер
export class UserController implements interfaces.Controller {

  constructor(@inject(TYPES.UserService) private userService: UserService) { // внедрение сервисов
  }

  @Post('/register') // маркируем метод как post запрос
  register(req: restify.Request, res: restify.Response, next: restify.Next) {
    this.userService.register(req.body.given_name, req.body.email, req.body.password, (err, user) => {
      if (err) {
        console.error(err.message);
        return res.json(new Response(false, err));
      }
      res.json(new Response(true, 'User was created', user));
      next();
    });
  }
}
```

Затем создадим `UserService`:

```typescript
@provideSingleton(TYPES.UserService) // маркируем сервис как внедряемый синглтон
export class UserService {

  constructor() {
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
}
```

**Рассмотрим работу с DynamoDB.**

Создадим таблицу:

```javascript
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

let params = {
  TableName : "Article"
};

dynamodb.deleteTable(params, function(err, data) {
  if (err) {
    console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});

params = {
  TableName : "Article",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH"},  //Partition key
    { AttributeName: "slug", KeyType: "RANGE" }  //Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "N" },
    { AttributeName: "slug", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
};

dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});
```

Добавим запись в таблицу:

```typescript
createArticle(body: any, cb: (newArticle) => any, err) {
  const key = {
    slug: body.slug,
    title: body.title
  };
  const value = {
    content: body.content
  };
  this.Article.insert(key, value).exec()
    .then(cb)
    .catch(err);
}
```

На этом все.