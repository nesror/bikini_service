import {getModelForClass, prop} from '@typegoose/typegoose';

class H5Record {
    @prop()
    public uid: string;
    @prop({default: Date.now()})
    public createdAt: Date;

    @prop()
    public br: string;
    @prop()
    public pm: string;
    @prop()
    public pr: string;
    @prop()
    public ww: string;
    @prop()
    public wh: string;
    @prop()
    public lang: string;
    @prop()
    public wv: string;
    @prop()
    public wvv: string;
    @prop()
    public wsdk: string;
    @prop()
    public sv: string;
    @prop()
    public nt: string;
    @prop()
    public lat: string;
    @prop()
    public lng: string;
    @prop()
    public ev: string;
    @prop()
    public tp: string;
    @prop()
    public ct: any;
    @prop()
    public at: string;
    @prop()
    public uu: string;
    @prop()
    public v: string;
    @prop()
    public wsr: any;
    @prop()
    public te: string;
    @prop()
    public et: string;
    @prop()
    public st: string;
}

export const H5RecordModel = getModelForClass(H5Record);

/**
 * 获取h5Record
 * @param pageNo 从1开始-必填
 * @param pageSize 每页数量-必填
 * @param find
 */
// eslint-disable-next-line max-params
export async function getH5Record(pageNo: number, pageSize: number, find: any): Promise<any | null> {
    const count = await H5RecordModel.find(find).count().exec();
    const info = await H5RecordModel.find(find).limit(pageSize).skip((pageNo - 1) * pageSize).sort({_id: -1}).exec();
    return { count, info };
}

/**
 * 存h5Record
 * @param h5Record
 */
export async function addH5Record(h5Record: H5Record): Promise<any> {
    return new Promise(resolve => {
        H5RecordModel.create(h5Record, (err: any) => {
            if (err) {
                resolve(err);
            } else {
                resolve('ok');
            }
        });
    });
}
