import { Context } from 'egg';
import { HttpResponse } from '../model/httpResponse';
import { stringify } from 'querystring';
import { ServletTraceLog } from '../model/log/traceLog';

// 出日志规范 xxx-insight.log
export default class HttpClientProxy<T> {
    private httpUrl: string;
    private data: any;
    private contentType = 'json';
    private dataType = 'json';

    /**
     * 必须先设置url
     * @param httpUrl url
     */
    public constructor(httpUrl: string) {
        this.httpUrl = httpUrl;
    }

    /**
     * 设置url上的参数
     * @param urlParam url上的参数
     */
    public setUrlParam(urlParam: { [index: string]: string | number }): HttpClientProxy<T> {
        this.httpUrl += '?' + stringify(urlParam);
        return this;
    }

    /**
     * 设置数据
     * @param data data
     */
    public setData(data: any): HttpClientProxy<T> {
        this.data = data;
        return this;
    }

    /**
     * setContentType
     * @param contentType
     * TODO 有空改成枚举
     */
    public setContentType(contentType: string): HttpClientProxy<T> {
        this.contentType = contentType;
        return this;
    }

    /**
     * setDataType
     * @param dataType
     * TODO 有空改成枚举
     */
    public setDataType(dataType: string): HttpClientProxy<T> {
        this.dataType = dataType;
        return this;
    }

    /**
     * post请求
     * @param ctx Context
     * @param useLogger
     */
    public async post(ctx: Context, useLogger = true): Promise<HttpResponse<T>> {
        if (!this.data) {
            throw new Error('post请求请设置data');
        }
        const startTime = Date.now();

        const res = await ctx.curl<HttpResponse<T>>(this.httpUrl, {
            method: 'POST',
            contentType: this.contentType,
            dataType: this.dataType,
            data: this.data
        });
        if (useLogger) {
            ctx.getLogger('accessLogger').info(
                ServletTraceLog.httpInsightLoggerInfo(startTime, ctx)
            );
            ctx.logger.info(`post->
    ##############  post  ###############
        ---URL:${this.httpUrl}
        ---body:${JSON.stringify(this.data)}
    -------------response----------------
        ---headers:${JSON.stringify(res.headers)}
        ---body:${JSON.stringify(res.data)}
    #####################################`);
        }

        return res;
    }

    /**
     * get请求
     * @param ctx Context
     * @param useLogger
     */
    public async get(ctx: Context, useLogger = true): Promise<HttpResponse<T>> {
        const startTime = Date.now();
        const res = await ctx.curl<HttpResponse<T>>(this.httpUrl, {
            contentType: this.contentType,
            dataType: this.dataType,
            data: this.data
        });
        if (useLogger) {
            ctx.getLogger('accessLogger').info(
                ServletTraceLog.httpInsightLoggerInfo(startTime, ctx)
            );
            ctx.logger.info(`
##############  get  ################
    ---URL:${this.httpUrl}
    ---DATA:${JSON.stringify(this.data ? this.data : {})}
-------------response----------------
    ---headers:${JSON.stringify(res.headers)}
    ---body:${JSON.stringify(res.data)}
#####################################`);
        }
        return res;
    }
}
