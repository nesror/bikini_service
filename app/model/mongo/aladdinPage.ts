import { getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import moment = require('moment');

@modelOptions({
    schemaOptions: {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
class AladdinPage {
    public _id: Types.ObjectId;
    @prop()
    public activityType: string;
    @prop()
    public activeId: string;
    @prop()
    public activeName: string;
    @prop()
    public attribution: string;
    @prop()
    public TemplateTitle: string;
    @prop()
    public TemplateType: string;
    @prop()
    public userId: string;
    @prop()
    public release: number;  // 0未发布，1已发布
    @prop()
    public startTime: string;
    @prop()
    public endTime: string;
    @prop()
    public deptId: string;
    @prop()
    public components: any[];
    @prop()
    public pageOptions: any;
    @prop()
    public otherOptions: any;
    @prop()
    public activeStartTime: string;
    @prop()
    public activeEndTime: string;
    @prop()
    public state: number; // 发布未发布，已结束 0未发布，1已发布，2已结束，3未开始
    @prop({ default: Date.now() })
    public createTime: Date;

    public get createAt() {
        return moment(this.createTime).format('YYYY-MM-DD HH:mm:ss');
    };

    public get id() {
        return this._id;
    };
}

export const AladdinPageModel = getModelForClass(AladdinPage);

/**
 * 获取AladdinPage
 * @param pageNo
 * @param pageSize
 * @param activityType
 * @param deptId
 * @param startDate
 * @param endDate
 */
// eslint-disable-next-line max-params
export async function getAladdinPage(pageNo: number, pageSize: number, activityType: string, deptId: string, startDate: Date, endDate: Date): Promise<{ total: number, data: AladdinPage[] | null }> {
    const find: any = {};
    if (startDate && endDate) {
        find.createTime = { $gte: startDate, $lte: endDate };
    }
    if (activityType) {
        find.activityType = activityType;
    }
    if (deptId) {
        find.deptId = deptId;
    }
    const total = await AladdinPageModel.find(find).count().exec();
    const data = await AladdinPageModel.find(find).limit(pageSize).skip((pageNo - 1) * pageSize).sort({ _id: -1 }).exec();
    return { total, data };
}

/**
 * 根据_id获取AladdinPage
 * @param _id
 */
export async function getAladdinPageById(_id: any): Promise<AladdinPage | null> {
    return AladdinPageModel.findOne({ _id }).exec();
}

/**
 * 创建AladdinPage
 * @param page
 */
export async function createAladdinPage(page: AladdinPage): Promise<any> {
    return new Promise(resolve => {
        AladdinPageModel.create(page, (err: any) => {
            resolve(err);
        });
    });
}

export async function createAladdinPages(page: AladdinPage[]): Promise<any> {
    return new Promise(resolve => {
        AladdinPageModel.create(page, (err: any) => {
            resolve(err);
        });
    });
}

/**
 * 根据_id修改发布状态
 * @param _id
 * @param release 0未发布，1已发布
 */
export async function updateRelease(_id: any, release: number): Promise<any> {
    return new Promise(resolve => {
        AladdinPageModel.updateOne({ _id }, { release }, null, (err: any) => {
            resolve(err);
        });
    });
}

/**
 * 根据_id修改模版
 * @param _id
 * @param page
 */
export async function updateAladdinPage(_id: any, page: AladdinPage): Promise<any> {
    return new Promise(resolve => {
        AladdinPageModel.updateOne({ _id }, page, null, (err: any) => {
            resolve(err);
        });
    });
}

/**
 * 根据_id删除(迁移前就是物理删除，没做修改)
 * @param _id
 */
export async function deleteAladdinPage(_id: any): Promise<any> {
    return new Promise(resolve => {
        AladdinPageModel.deleteOne({ _id }, (err: any) => {
            resolve(err);
        });
    });
}
