import {getModelForClass, prop} from '@typegoose/typegoose';

export class Activity618UserInfo {
    public myIndex: number;
    @prop()
    public phone: string;
    @prop()
    public cardName: string;
    /**
     * 用户类型：0：真实用户，1：虚拟用户
     */
    @prop()
    public type: number;
    /**
     * 中奖情况：0未中奖，1：第一次抽奖中奖
     */
    @prop()
    public drawType: number;
}

export const activity618UserInfoModel = getModelForClass(Activity618UserInfo);

/**
 * 创建用户
 */
export async function createUser(users: Activity618UserInfo[]): Promise<any> {
    return new Promise(resolve => {
        activity618UserInfoModel.create(users, (err: any) => {
            resolve(err);
        });
    });
}

/**
 * 查找用户
 * @param drawType 是否按照抽奖轮数排序
 * @param gt
 * @param lte
 */
export async function findUser(lte?: number, drawType = false, gt = 0): Promise<Activity618UserInfo[] | null> {
    const find: any = {};
    if (lte) {
        find.drawType = {$gt: gt, $lte: lte};
    }
    let sort: any = {_id: -1};
    if (drawType) {
        sort = {drawType: 1,_id: -1};
    }
    // const total = await activity618UserInfoModel.find(find).count().exec();
    // const data = await activity618UserInfoModel.find(find).sort({_id: -1}).exec();
    // return {total, data};
    return activity618UserInfoModel.find(find).sort(sort).exec();
}
