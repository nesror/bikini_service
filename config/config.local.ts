import { EggAppConfig, PowerPartial, EggAppInfo } from 'egg';
import { join } from 'path';

export default (appInfo: EggAppInfo) => {
    const config: PowerPartial<EggAppConfig> = {};

    config.alinode = {
        server: 'wss://agentserver.node.aliyun.com:8080',
        appid: '90277',
        secret: '4770eac81c2cf0b1ddbc02afa70e03c6041685b5',
        logdir: join(appInfo.root, `logs/${appInfo.name}/alinode`),
        // error_log: [join(appInfo.root, `logs/${appInfo.name}/${appInfo.name}-error.log`)],
        // packages: [resolve(__dirname, '..') + '/package.json']
    };

    config.logger = {
        dir: join(appInfo.root, `logs/${appInfo.name}`),
        appLogName: `${appInfo.name}-biz.log`,
        errorLogName: `${appInfo.name}-error.log`,
        consoleLevel: 'DEBUG'
    };

    config.customLogger = {
        accessLogger: {
            file: join(appInfo.root, `logs/${appInfo.name}-access.log`)
        },
        digestLogger: {
            file: join(appInfo.root, `logs/${appInfo.name}-digest.log`)
        }
    };

    // config.mongoose = {
    //     client: {
    //         url:
    //             `mongodb://mongodb1.cluster.com:27017,mongodb2.cluster.com:27017,mongodb3.cluster.com:27017/${appInfo.name}`,
    //         options: {
    //             mongos: true,
    //             db: { native_parser: true },
    //             server: {
    //                 poolSize: 5,
    //                 auto_reconnect: true,
    //                 socketOptions: { keepAlive: 1 }
    //             },
    //             replset: { rs_name: 'gabriel' },
    //             useNewUrlParser: true,
    //             useUnifiedTopology: true
    //         }
    //     }
    // };

    // config.sequelize = {
    //     host: 'xxx',
    //     username: 'xxx',
    //     password: 'xxx',
    //     port: 3306,
    //     database: 'xxx'
    // };


    return config;
};
