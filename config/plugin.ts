import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    redis: {
        enable: true,
        package: 'egg-redis',
    },
    alinode: {
        enable: true,
        package: 'egg-alinode',
        // env: ['prod']
    },
    websocket: {
        enable: true,
        package: 'egg-websocket-plugin',
    },
    // rpc: {
    //     enable: true,
    //     package: 'egg-rpc-base',
    // },
    // dubboRpc: {
    //     enable: true,
    //     package: 'egg-dubbo-rpc',
    // },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
};

export default plugin;
