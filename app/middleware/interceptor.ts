import { Context } from 'egg';
import { ServletTraceLog } from '../model/log/traceLog';

/**
 * 中间件
 */
export default () => {
    return async function interceptor(ctx: Context, next: () => Promise<any>) {
        const { app, request, response } = ctx;

        // if (!canAllow(ctx)) {
        //     app.logger.info(
        //         '以下ip访问了不允许访问的方法->' + ctx.ip + ',' + request.headers['x-real-ip']
        //     );
        //     return;
        // }

        // app.logger.info("------------>>>>>>\n"+JSON.stringify(request.body));
        // 处理网关默认加的而外参数
        // if (request.method === 'POST') {
        //     if (request.body.data && typeof request.body.data === 'string') {
        //         request['body'] = JSON.parse(decodeURIComponent(request.body.data)).info
        //             ? JSON.parse(decodeURIComponent(request.body.data)).info
        //             : JSON.parse(decodeURIComponent(request.body.data));
        //     }
        // } else {
        //     request.query = request.query.data
        //         ? JSON.parse(decodeURIComponent(request.query.data))
        //         : request.query;
        // }

        const startTime = Date.now();

        await next();

        // http进日志规范 xxx-digest.log
        app.getLogger('digestLogger').info(ServletTraceLog.httpDigestLoggerInfo(startTime, ctx));

        // 封装出参数据
        let stateCode = response.body ? response.body.stateCode : null;
        if (!stateCode) {
            stateCode = ctx.status === 200 ? 0 : ctx.status;
        }

        if (stateCode) {
            app.logger.error(request.URL, response.body);
        }

        response['body'] = {
            stateCode,
            success: stateCode ? false : true,
            message: stateCode ? response.body : null,
            data: stateCode ? null : response.body,
        };

        ctx.status = 200;
        const httpLog = `
        ############ http ${ctx.status}##############
            ---IP:${ctx.ip}
            ---URL:${request.URL}
            ---headers:${JSON.stringify(request.headers)}
            ---body:${JSON.stringify(request.body)}
        -------------response----------------
            ---headers:${JSON.stringify(response.headers)}
            ---body:${JSON.stringify(response.body)}
        ####################################`;
        app.logger.info(httpLog);
        if (app.config.env === 'local') {
            console.log(httpLog);
        }
    };
};

/**
 * 判断接口是否允许外网访问
 */
// function canAllow(ctx: Context): boolean {
//     const { path } = ctx;
//     const ip = ctx.request.headers['x-real-ip'];

//     // 允许外网访问
//     if (path.startsWith('/callback/') || path === '/' || (path.startsWith('/h5/') && ctx.request.method === 'GET')) {
//         return true;
//     }

//     if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ctx.app.config.env === 'local') {
//         return true;
//     }

//     const aryIpAddress = ip.split('.');

//     if (aryIpAddress[0] === '10') {
//         return true;
//     }

//     if (aryIpAddress[0] === '192' && aryIpAddress[1] === '168') {
//         return true;
//     }

//     if (aryIpAddress[0] === '172') {
//         const num = parseInt(aryIpAddress[1], 10);
//         if (num >= 16 && num <= 31) {
//             return true;
//         }
//     }

//     return false;
// }
