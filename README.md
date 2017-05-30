We are going to compile the project in JavaScript with help of IntelliJIdea. 

**The project structure**
```
.
├── README.md
├── bin
│   └── www // enterpoint for the local server
├── package.json
├── serverless.yml // a configuration of Serverless Framework 
├── src
│   ├── config
│   │   ├── config.json // a configuration of the local project
│   │   └── config.ts
│   ├── constant
│   │   ├── app-constants.ts
│   │   ├── tags.ts
│   │   └── types.ts
│   ├── controller // controllers based on inversify-restify-utils 
│   │   ├── article.controller.ts
│   │   ├── home.controller.ts
│   │   └── user.controller.ts
│   ├── http
│   │   └── response.ts
│   ├── ioc // inversify
│   │   ├── ioc.ts
│   │   └── loader.ts
│   ├── lambda.ts // enterpoint for AWS Lambda
│   ├── server-base.ts // the base class for the server. base settings
│   ├── server-lambda.ts // inherited from base, class for lambda 
│   ├── server-local.ts // inherited from base, class for local
│   └── service
│       ├── article.service.ts
│       └── user.service.ts
└── tsconfig.json
```

For that purpose edit `tsconfig.js` by setting `compileOnSave` to `true`
```{
  "compileOnSave": true, // required for onfly compilation
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
Enable TypeScript compiler in the settings:

![Compiler's settings](https://monosnap.com/file/xcOIklg078fiN22lUTXG9aPqIhP6R0.png)

Add task `Compile TypeScript` before launching:

![Compile TypeScript](https://monosnap.com/file/cbi6Qfa2tZQMD4Bqer4Dy7jo7TriKh.png)

Create watcher for `config.json`. It watches for changes and copies that file
to `dist/config`
![File watcher](https://monosnap.com/file/eq6EuGQ8YbI6wq9ROKRMj1BS1KLXq9.png)

**All previous tasks can be done using grunt or gulp**

Configure Inversion of Control. By creating `ioc.ts`:

```typescript
import 'reflect-metadata'; // don't forget to import this 
import {Container, inject} from 'inversify';
import {autoProvide, makeProvideDecorator, makeFluentProvideDecorator} from 'inversify-binding-decorators';
import {makeLoggerMiddleware} from 'inversify-logger-middleware';

let container = new Container();

if (process.env.NODE_ENV === 'development') { // for logging of injections
  // let logger = makeLoggerMiddleware();
  // container.applyMiddleware(logger);
}

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideSingleton = function(identifier) { // the annotation for providing singleton
  return fluentProvider(identifier)
    .inSingletonScope()
    .done();
};

let provideNamed = function (identifier, name) { // the annotation for providing by name
  return fluentProvider(identifier)
    .inSingletonScope()
    .whenTargetNamed(name)
    .done();
};

let bindDependencies = function (func, dependencies) { // for a function injections. e.g. func = bindDependencies(myFunc, [TYPES.MyService]); func();
  let injections = dependencies.map((dependency) => {
    return container.get(dependency);
  });
  return func.bind(func, ...injections);
};

export {container, autoProvide, provide, provideNamed, provideSingleton,
  inject, bindDependencies};
```

Import all dependencies in `loader.ts`:

```typescript
import '../controller/home.controller';
import '../controller/user.controller';
import '../controller/article.controller';
import '../service/user.service';
import '../service/article.service';
```

**Let's configure server**

Configuration:
```typescript
config(app) {
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
  
  app.use(helmet()); // прячем некоторые заголовки вроде X-Powered-By
}
```

Place the server in the inversify container:

```typescript
bootstrap(): restify.Server {
  super.bootstrap();
  //create restify application
  this.app = new InversifyRestifyServer(container, {
    name: AppConstants.APP_NAME,
    version: nconf.get("server:api_version"),
    log: this.logger
  }).setConfig((app) => {
    this.config(app);
    this.listen(app);
  }).build();
}
```

Let's create the `UserController` controller:

```typescript
@Controller('/users') // annotation from inversify-restify-utils
@provideNamed(TYPE.Controller, TAGS.UserController) // inject by name
export class UserController implements interfaces.Controller {

  constructor(@inject(TYPES.UserService) private userService: UserService) { // injecting services
  }

  @Post('/register') // annotate method as the post request
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

Let's create the `UserService`:

```typescript
@provideSingleton(TYPES.UserService) // inject as singleton 
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

**Let's look at working with DynamoDB**

Create table:

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

Insert a record in the table:

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

**Deployment**

Before deployment you need to configure zipping of `node_modules` and `dist` folders.
There is an example of `External Toole`
![External tool](https://monosnap.com/file/0YirIoGvQQbaaurnakYk9fXCLzhxTH.png)

Then add this tool to the tasks before launching:
![Before launch](https://monosnap.com/file/klsBXaoHEZh2L9QLLxkKe8kFqHZNRp.png)

Install required packages:
```typescript
npm i
```

Deploy packages by running
```typescript
npm run sls-deploy
```
