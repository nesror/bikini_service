const USER_HOME = process.env.HOME || process.env.USERPROFILE
import { resolve } from 'path';

export const bizConfig = {
    alinode: {
        server: 'wss://agentserver.node.aliyun.com:8080',
        appid: '90277',
        secret: '4770eac81c2cf0b1ddbc02afa70e03c6041685b5',
        logdir: USER_HOME + '/logs/alinode/',
        packages: [
            resolve(__dirname, '..') + "/package.json"
        ],
    },
    sequelize: {
        host: 'www.yzapp.cn',
        username: process.env.NESTOR_KEYSTORE_ALIAS,
        password: process.env.NESTOR_KEYSTORE_MYSQL,
        port: 3306,
        database: 'nodedb',
        timezone: 'Asia/Shanghai',
    },
    mysql: true
}