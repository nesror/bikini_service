import { DubboInfo } from './dubboInfo';
import { Application, Context } from 'egg';
import { getIPAddress } from '../../util/utils';

class BaseTraceLog {
    /**  */
    public static serialVersionUID = 1906829314650743230n;
    /**
     * 项目信息
     */
    public project: string;
    /**
     * 环境信息
     */
    public env: string;
    /**
     * 子环境
     */
    public subEnv: string;
    /**
     * insight版本号
     */
    public iversion: number;

    /**
     * 自增深度
     */
    public depth: number;

    /**
     * 自增序号
     */
    public order: number;

    /**
     * 调用入口应用名，最先到终端app之类
     */
    public entryAppName: string;

    /**
     * 调用入口名
     */
    public entryName: string;
    /**
     * 调用链路ID
     */
    public insightRequestId: string;
    /**
     * 支线名称
     */
    public sidingName: string;
    /**
     * 业务数据
     */
    public attachments: any;
    /**
     * 调用链路中的应用名
     */
    public appName: string;
    /**
     * 当前毫秒
     */
    public currentTimeMillis: number;
    /**
     * 调用远程地址
     */
    public invokeRemoteHost: string;
    /**
     * 调用远程端口
     */
    public invokeRemotePort: number;
    /**
     * 调用本地地址
     */
    public invokeLocalHost: string;
    /**
     * 调用本地端口
     */
    public invokeLocalPort: number;
    /**
     * 调用方法   服务名.方法名
     */
    public invokeMethod: string;
    /**
     * 版本号
     */
    public version: string;
    /**
     * 响应时间
     */
    public responseTime: number;
    /**
     * 调用渠道   DUBBO_PROVIDER > dubbo调用者,  DUBBO_COMSUMER > dubbo消息者
     */
    public InvokeChannel: string;
    /**
     * 调用结果
     */
    public invokeResult: string;
    /**
     * 入参
     */
    public params: any;
    /**
     * 出参
     */
    public resultData: any;
}

export class DubboTraceLog extends BaseTraceLog {
    /**
     * 调用dubbo日志格式处理
     * @param app app
     * @param info DubboInfo
     */
    public static dubboLoggerInfo(app: Application, info: DubboInfo): string {
        const { ctx, targetAppName, methodName, meta, serverSignature, args } = info.req;

        const attachments = ctx.request.header;
        attachments.method = ctx.request.method;
        attachments.url = ctx.request.url;

        const dubboTraceLog = new this();
        dubboTraceLog.appName = targetAppName;
        dubboTraceLog.attachments = attachments;
        dubboTraceLog.currentTimeMillis = Date.now();
        dubboTraceLog.entryAppName = attachments['user-agent']
            ? attachments['user-agent']
            : targetAppName;
        dubboTraceLog.entryName = attachments.url;
        dubboTraceLog.env = app.config.env;
        dubboTraceLog.InvokeChannel = 'DUBBO_COMSUMER';
        dubboTraceLog.invokeLocalHost = getIPAddress();
        dubboTraceLog.invokeLocalPort = 7001;
        dubboTraceLog.invokeMethod = serverSignature.split(':')[0] + '.' + methodName;
        dubboTraceLog.invokeRemoteHost = meta.address.hostname;
        dubboTraceLog.invokeLocalPort = Number(meta.address.port);
        dubboTraceLog.invokeResult = info.res.error ? 'false' : 'true';
        dubboTraceLog.params = args[0].$;
        dubboTraceLog.responseTime = dubboTraceLog.currentTimeMillis - meta.start;
        dubboTraceLog.resultData = info.res.appResponse;
        dubboTraceLog.version = app.config.version;
        // dubboTraceLog.project
        // dubboTraceLog.iversion = 0
        // TODO dubboTraceLog.insightRequestId = [网关的superapiplus]
        return JSON.stringify(dubboTraceLog);
    }

    public logtype = 'dubboTraceLog';
}

export class ServletTraceLog extends BaseTraceLog {
    /**
     * 调用http日志格式处理
     * @param srartTime 请求开始时间
     * @param ctx Context
     */
    public static httpInsightLoggerInfo(srartTime: number, ctx: Context): string {
        // ctx.logger.debug('httpInsightLoggerInfo-ctx->', JSON.stringify(ctx));
        const attachments = ctx.request.headers;
        attachments.method = ctx.request.method;
        attachments.url = ctx.request.url;

        const servletTraceLog = new this();
        servletTraceLog.appName = ctx.app.config.appName;
        servletTraceLog.attachments = attachments;
        servletTraceLog.currentTimeMillis = Date.now();
        servletTraceLog.entryAppName = attachments['user-agent']
            ? attachments['user-agent']
            : servletTraceLog.appName;
        servletTraceLog.entryName = attachments.url;
        servletTraceLog.env = ctx.app.config.env;
        servletTraceLog.InvokeChannel = 'SERVLET_COMSUMER';
        servletTraceLog.invokeResult = ctx.response.status === 200 ? 'true' : 'false';
        servletTraceLog.params = ctx.request.body ? ctx.request.body : '';
        servletTraceLog.responseTime = servletTraceLog.currentTimeMillis - srartTime;
        servletTraceLog.resultData = ctx.response;
        servletTraceLog.version = ctx.app.config.version;
        return JSON.stringify(servletTraceLog);
    }

    /**
     * 被调用http日志格式处理
     * @param srartTime 请求开始时间
     * @param ctx Context
     */
    public static httpDigestLoggerInfo(srartTime: number, ctx: Context): string {
        // ctx.logger.debug('httpDigestLoggerInfo-ctx->', JSON.stringify(ctx));
        const attachments = ctx.request.headers;
        attachments.method = ctx.request.method;
        attachments.url = ctx.request.url;

        const servletTraceLog = new this();
        servletTraceLog.appName = ctx.app.config.appName;
        servletTraceLog.attachments = attachments;
        servletTraceLog.currentTimeMillis = Date.now();
        servletTraceLog.entryAppName = attachments['user-agent'] ? attachments['user-agent'] : '';
        servletTraceLog.entryName = ctx.path;
        servletTraceLog.env = ctx.app.config.env;
        servletTraceLog.InvokeChannel = 'SERVLET_PROVIDER';
        servletTraceLog.invokeResult = String(ctx.status);
        servletTraceLog.params = ctx.request.body ? ctx.request.body : '';
        servletTraceLog.responseTime = servletTraceLog.currentTimeMillis - srartTime;
        servletTraceLog.resultData = ctx.response;
        servletTraceLog.version = ctx.app.config.version;

        return JSON.stringify(servletTraceLog);
    }

    public logtype = 'servletTraceLog';
}
