import {Controller} from 'egg';

export default class InterviewController extends Controller {
    public async readInterview() {
        const {ctx, service} = this;
        const info = await service.interview.findInterviewById(Number(ctx.request.query.id));
        if (info === null) {
            ctx.status = 500;
            ctx.body = "未找到数据";
            return;
        }
        ctx.body = info;
    }

    public async readInterviews() {
        const {ctx, service} = this;
        ctx.body = await service.interview.findInterviews();
    }

    public async createInterview() {
        const {ctx, service} = this;
        // const { intervieweeName, intervieweeEmail, interviewerName, interviewerEmail } = ctx.request.body;

        const info = await service.interview.createOrUpdateInterview(ctx.request.body);

        if (info === null) {
            ctx.status = 500;
            ctx.body = "插入数据失败";
            return;
        }
        const msg = await service.email.sendInterviewEmail(info.id);

        if (msg !== null) {
            ctx.status = 500;
            ctx.body = msg;
            return;
        }
        ctx.body = info.id;
    }

    public async updateInterview() {
        const {ctx, service} = this;
        const {id, value} = ctx.request.body;

        const info = await service.interview.updateValue(id, Buffer.from(value));

        if (info[0] === 0) {
            ctx.status = 500;
            ctx.body = `插入失败没有找到${id}的数据`;
            return;
        }
        ctx.body = id;
    }

    public async interviewWebSocket() {
        const {ctx, service} = this;
        if (!ctx.websocket) {
            ctx.status = 500;
            ctx.body = "只允许ws方法调用";
            return;
        }
        const errMsg = await service.interview.syncValue(ctx.websocket, ctx.request.query.id);
        if (errMsg) {
            ctx.status = 500;
            ctx.body = errMsg;
        }
    }
}
