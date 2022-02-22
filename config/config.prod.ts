import { EggAppConfig, PowerPartial, EggAppInfo } from 'egg';
import { join } from 'path';
import { bizConfig } from './bizConfig';

export default (appInfo: EggAppInfo) => {
    const config: PowerPartial<EggAppConfig> = {};

    config.alinode = bizConfig.alinode;

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

    // config.sequelize = {
    //     host: 'xxx',
    //     username: 'xxx',
    //     password: 'xxx',
    //     port: 3306,
    //     database: 'xxx'
    // };

    return config;
};
