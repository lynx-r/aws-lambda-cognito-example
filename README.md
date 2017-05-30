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
├── api-gateway-event.json
├── bin
│   ├── www
│   └── www-lambda
├── cloudformation.yaml
├── package.json
├── packaged-sam.yaml
├── pbcopy
├── restify-typescript-mongoose.iml
├── scripts
│   ├── configure.js
│   ├── deconfigure.js
│   ├── local.js
│   ├── utils.js
│   └── zip-dist.js
├── serverless.yml
├── simple-proxy-api.yaml
├── src
│   ├── config
│   │   ├── config.json
│   │   └── config.ts
│   ├── constant
│   │   ├── app-constants.ts
│   │   ├── tags.ts
│   │   └── types.ts
│   ├── controller
│   │   ├── article.controller.ts
│   │   ├── home.controller.ts
│   │   └── user.controller.ts
│   ├── http
│   │   └── response.ts
│   ├── ioc
│   │   ├── ioc.ts
│   │   └── loader.ts
│   ├── lambda.ts
│   ├── server-base.ts
│   ├── server-lambda.ts
│   ├── server-local.ts
│   └── service
│       ├── article.service.ts
│       ├── socket.service.ts
│       └── user.service.ts
└── tsconfig.json
```



Используемые технологии:

Restify - сервер

Dynongo - библиотека для работы с DynamoDB

Inversify - DI

inversify-restify-utils - class based controllers

Cognito - система управления пользователями
