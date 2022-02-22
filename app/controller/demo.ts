import { Controller } from 'egg';
import { Page, PageModel, getPageByPageNo } from '../model/mongo/page';

/**
 * demo
 */
export default class Demo extends Controller {
    /**
     * demo
     */
    public async demo() {
        const { ctx, logger, app } = this;
        logger.debug('info->', JSON.stringify(ctx.params.type));

        switch (ctx.params.type) {
            case 'dubbo':
                ctx.body = `1.进入gradleproject配置好maven地址和需要的jar和源码包;
                2.在config/proxy.js编辑需要使用的类
                3.运行rpc-generator.sh;
                4.app/proxy自动生成js和d.ts文件;
                5.调用app/proxy对应的方法;
                6...`;
                break;
            case 'database':
                ctx.body = await this.database();
                break;
            default:
                ctx.body = app.config.env + ':有效参数：dubbo\ndatabase';
                break;
        }
    }

    private async database(): Promise<Page | null> {
        const { app } = this;
        const page = JSON.parse(`{
            "groups":[
                {
                    "type":"banner",
                    "style":"",
                    "views":[
                        {
                            "type":"image",
                            "style":"",
                            "src":"http://sdsd.png",
                            "jump":{
                                "page":"pages/store/index/main",
                                "params":"json字符串",
                                "login":false
                            }
                        }
                    ]
                },
                {
                    "type":"line",
                    "style":"",
                    "groups":[
                        {
                            "type":"list",
                            "style":"",
                            "views":[
                                {
                                    "type":"text",
                                    "style":"",
                                    "text":""
                                }
                            ]
                        }
                    ]
                }
            ],
            "pageNo":"home_1"
        }`);
        await PageModel.create(page, null, (err: any) => {
            if (err) {
                app.logger.error(err);
                return;
            }
        });
        return getPageByPageNo('home_1', 1, "");
    }
}
