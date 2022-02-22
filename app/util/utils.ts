import {networkInterfaces} from 'os';
import {Context} from 'egg';

/**
 * 获取ip地址
 */
export function getIPAddress(): string {
    const interfaces = networkInterfaces();
    for (const devName in interfaces) {
        if (interfaces.hasOwnProperty(devName)) {
            const iface = interfaces[devName];
            for (const alias of iface) {
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }
    return '';
}

/**
 * 判断参数是否为空
 * @param ctx
 * @param paramNames
 */
export function checkParams(ctx: Context, ...paramNames: string[]): boolean {
    let msg = '';
    paramNames.forEach(paramName => {
        if (ctx.request.method === 'GET') {
            if (!ctx.query[paramName]) {
                msg += paramName + ' ';
            }
        } else {
            if (!ctx.body[paramName]) {
                msg += paramName + ' ';
            }
        }

    });
    if (msg) {
        msg += '不能为空';
        ctx.body = {
            stateCode: {
                code: -400,
                desc: msg,
            },
        };
        return false;
    }
    return true;
}

export function checkObjectId(ctx: Context, id: any): boolean {
    if (id.toString().length != 24) {
        ctx.body = {
            stateCode: {
                code: -400,
                desc: "不是ObjectId",
            },
        };
        return false;
    }
    return true;
}

/**
 * 设置网关http错误信息
 * @param ctx
 * @param code
 * @param desc
 */
export function setHttpErrMsg(ctx: Context, code: number, desc: string) {
    ctx.body = {
        stateCode: {
            code,
            desc,
        },
    };
}

/**
 * 设置网关http信息
 * @param ctx
 * @param errMsg
 * @param errCode
 * @param body
 */
export function setHttpBody(ctx: Context, errMsg: string, errCode: number = -500, body: any = true) {
    if (errMsg) {
        setHttpErrMsg(ctx, errCode, errMsg);
    } else {
        ctx.body = body;
    }
}

/**
 * 随机生成手机号
 */
export function getRandomMobile(): string {
    const prefixArray = ["139", "138", "137", "136", "135", "134", "159", "158", "157", "150", "151", "152", "188", "187", "182", "183", "184", "178", "130", "131", "132", "156", "155", "186", "185", "176", "133", "153", "189", "180", "181", "177"];
    const i = Math.floor(prefixArray.length * Math.random());
    let prefix = prefixArray[i];
    for (let j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    }
    return prefix;
}

/**
 * 随机选数组
 */
export function getRandom<T>(info: T[]): T {
    const i = Math.floor(info.length * Math.random());
    return info[i];
}

/**
 * 随机抽取
 * @param info
 * @param size 抽取数量
 */
export function randomGet<T>(info: T[], size: number): T[] {
    if (info.length <= size) {
        return info;
    }
    const result = new Array<T>();

    for (let i = 0; i < size; i++) {
        const ran = Math.floor(Math.random() * info.length);
        result.push(info.splice(ran, 1)[0]);
    }

    return result;
}

/**
 * 判断字符串是否是json
 * @param str
 */
export function isJSON(str) {
    if (typeof str === 'string') {
        try {
            const obj = JSON.parse(str);
            return !!(typeof obj === 'object' && obj);
        } catch (e) {
            return false;
        }
    }else {
        return false;
    }
}
