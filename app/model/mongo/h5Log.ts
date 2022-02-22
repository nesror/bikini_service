import {getModelForClass, prop} from '@typegoose/typegoose';

class LogInfo {
    @prop()
    public ua: string;
    @prop()
    public msg: string;
    @prop()
    public url: string;
    @prop()
    public line: string;
    @prop()
    public col: string;
    @prop()
    public type: string;
    @prop()
    public error: any;
    @prop({default: Date.now()})
    public createdAt: Date;
    @prop()
    public name: string;
}

export const LogInfoModel = getModelForClass(LogInfo);

/**
 * 获取h5日志数据
 * @param pageNo 从1开始-必填
 * @param pageSize 每页数量-必填
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @param type 类型
 */
// eslint-disable-next-line max-params
export async function getLogInfo(pageNo: number, pageSize: number, startDate: Date, endDate: Date, type: string): Promise<any | null> {
    const find: any = {};
    if (startDate && endDate) {
        find.createdAt = {$gte: startDate, $lte: endDate};
    }
    if (type) {
        find.type = type;
    }
    const count = await LogInfoModel.find(find).count().exec();
    const info = await LogInfoModel.find(find).limit(pageSize).skip((pageNo - 1) * pageSize).sort({_id: -1}).exec();
    return { count, info };
}

/**
 * 存h5日志数据
 * @param logInfo
 */
export async function addLogInfo(logInfo: LogInfo): Promise<any> {
    return new Promise(resolve => {
        LogInfoModel.create(logInfo, (err: any) => {
            if (err) {
                resolve(err);
            } else {
                resolve('ok');
            }
        });
    });
}
