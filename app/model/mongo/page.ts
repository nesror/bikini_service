import { prop, getModelForClass, index } from '@typegoose/typegoose';
class ViewBase {
    @prop()
    public type: string;
    @prop()
    public style: string;
    @prop()
    public src: string;
    @prop()
    public title: string;
    @prop()
    public content: string;
}

export class Jump {
    @prop()
    public page: string;
    @prop()
    public params: string;
    @prop()
    public login: boolean;
}

export class View extends ViewBase {
    @prop()
    public jump: Jump;
}

export class Group extends ViewBase {
    @prop()
    public groups: Group[];
    @prop()
    public views: View[];
}

@index({ pageNo: 1, version: -1, appid: 1 }, { unique: true })
export class Page {
    @prop()
    public groups: Group[];
    @prop()
    public pageNo: string;
    @prop()
    public version: number;
    @prop()
    public appid: string;
}

export const PageModel = getModelForClass(Page);

/**
 * 根据PageNo查最新版本的Page
 * @param pageNo  页面号
 * @param version 小程序版本号
 * @param appid
 */
export async function getPageByPageNo(pageNo: string, version: number, appid: string): Promise<Page | null> {
    let page = await PageModel.findOne({ pageNo, version, appid }).exec();
    if (!page) {
        page = await PageModel.findOne({ pageNo, appid }).exec();;
    }
    if (!page) {
        page = await PageModel.findOne({ pageNo, appid: "wx4a8c1f2a3f1506e3" }).exec();
    }
    return page;
}

/**
 * 增加page
 * @param page
 */
export async function savePageByPageNo(page: Page): Promise<any> {
    // page.version = new Date().getTime()
    return new Promise(resolve => {
        PageModel.create(page, (err: any) => {
            resolve(err);
        });
    });
}

export async function updatePage(page: Page): Promise<any> {
    return new Promise(resolve => {
        PageModel.updateOne(
            { pageNo: page.pageNo, version: page.version, appid: page.appid },
            { groups: page.groups },
            null,
            (err: any) => {
                resolve(err);
            }
        );
    });
}
