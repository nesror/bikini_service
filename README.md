# bikini_service
Online written test procedure  
typegoose，redis，sequelize-typescript

### Development

1.mysql账号密码环境变量(找我要)
```
export NESTOR_KEYSTORE_MYSQL=xxx
export NESTOR_KEYSTORE_ALIAS=xxs
```

2.
```bash
$ npm i
$ npm run dev
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### 生产环境

```bash
sh ./start.sh
```
### node性能平台
https://node.console.aliyun.com/dashboard/apps/90277/#!/agents
### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js v12.13.0+
- Typescript 2.8+
