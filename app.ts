/* eslint-disable no-path-concat */
import { IBoot, Application } from 'egg';
import { Sequelize } from 'sequelize-typescript';
import { resolve } from 'path';
// import { mongoose } from '@typegoose/typegoose';

export default class FooBoot implements IBoot {
    private readonly app: Application;

    public constructor(app: Application) {
        this.app = app;
    }

    public configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
    }

    public configDidLoad() {
        // Config, plugin files have loaded.
    }

    public async didLoad() {
        // All files have loaded, start plugin here.
    }

    public async willReady() {
        const app = this.app;
        // const { rpcClient, getLogger } = this.app;
        // mysql
        let sequelize: Sequelize
        if (app.config.mysql) {
            // mysql
            sequelize = new Sequelize({
                dialect: 'mysql',
                host: app.config.sequelize.host,
                username: app.config.sequelize.username,
                password: app.config.sequelize.password,
                port: app.config.sequelize.port,
                database: app.config.sequelize.database,
                models: [__dirname + '/app/model/sql/*.model.ts']
            });
        } else {
            // sqlite
            sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: resolve(__dirname, '/datebase/db.sqlite'),
                models: [__dirname + '/app/model/sql/*.model.ts']
            });
        }

        sequelize
            .sync()
            .then(() => {
                app.logger.info('init db ok')
            })
            .catch(err => {
                app.logger.error('init db error', err)
            })

        // {
        //     mongos: true,
        //     db: { native_parser: true },
        //     server: {
        //         poolSize: 5,
        //         auto_reconnect: true,
        //         socketOptions: { keepAlive: 1 }
        //     },
        //     replset: { rs_name: 'gabriel' },
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // }
        // await mongoose.connect(
        //     'mongodb://mongodb1.cluster.com:27017,mongodb2.cluster.com:27017,mongodb3.cluster.com:27017',
        //     {
        //         dbName: 'bikini',
        //         // 线上mongodb版本不支持
        //         // nativeParser: true,
        //         poolSize: 5,
        //         //useCreateIndex: true,
        //         autoReconnect: true,
        //         useNewUrlParser: true,
        //         useUnifiedTopology: true
        //     }
        // );

        // rpc出日志规范 xxx-insight.log
        // rpcClient.on('request', () => {});
        // rpcClient.on('response', (info: DubboInfo) => {
        //     getLogger('accessLogger').info(DubboTraceLog.dubboLoggerInfo(this.app, info));
        // });
    }

    public async didReady() { }

    public async serverDidReady() { }

    public async beforeClose() { }
}
