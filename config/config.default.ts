/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-require-imports */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { bizConfig } from './bizConfig';

export default (appInfo: EggAppInfo) => {
    const config = {} as PowerPartial<EggAppConfig>;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1573700843490_3607';

    // add your egg config in here
    config.middleware = ['interceptor'];

    // 覆盖egg自带的配置
    config.bodyParser = {
        enable: true,
        encoding: 'utf8',
        formLimit: '100kb',
        jsonLimit: '100kb',
        strict: true,
        queryString: {
            arrayLimit: 100,
            depth: 5,
            parameterLimit: 1000,
        },
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml'],
        },
    };

    config.multipart = {
        mode: 'file',
    };

    config.security = {
        csrf: {
            enable: false, // 前后端分离，post请求不方便携带_csrf
            ignoreJSON: true,
        },
        domainWhiteList: ['https://sale.qccr.com/', 'http://localhost'], // 配置白名单
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };

    config.websocket = {
        // 配置 websocket 使用 redis 作消息广播，配置项目参见 ioredis
        redis: {
            host: 'www.yzapp.cn',
            port: 6379,
            password: "test@@##$$226688",
            db: 0
        },
    };

    // redis
    // config.redis = {
    //     client: {
    //         cluster: true,
    //         nodes: [
    //             {
    //                 host: 'redis1.cluster.com',
    //                 port: 6379,
    //                 password: '',
    //                 db: 0
    //             },
    //             {
    //                 host: 'redis2.cluster.com',
    //                 port: 6379,
    //                 password: '',
    //                 db: 0
    //             },
    //             {
    //                 host: 'redis3.cluster.com',
    //                 port: 6379,
    //                 password: '',
    //                 db: 0
    //             }
    //         ]
    //     }
    // };

    // the return config will combines to EggAppConfig
    return {
        ...(config as {}),
        ...bizConfig,
    };
};
