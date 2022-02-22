import { Controller } from 'egg';
import Interview from '../model/sql/interview.model';

enum WSTypes {
    heartbeat = '.',
    setValue = '0',
    getValue = '1',
}

const encode = new TextEncoder();
const decode = new TextDecoder('utf-8');

export default class InterviewController extends Controller {
    public async readInterview() {
        const { ctx, service } = this;
        const info = await service.interview.findInterviewById(Number(ctx.request.query.id));
        if (info === null) {
            ctx.status = 500;
            ctx.body = "未找到数据";
            return
        }
        ctx.body = info;
    }
    public async readInterviews() {
        const { ctx, } = this;
        const info = await Interview.findAll();
        ctx.body = info;
    }

    public async createInterview() {
        const { ctx, service } = this;
        // const { intervieweeName, intervieweeEmail, interviewerName, interviewerEmail } = ctx.request.body;

        const info = await service.interview.createOrUpdateInterview(ctx.request.body);

        if (info === null) {
            ctx.status = 500;
            ctx.body = "插入数据失败";
            return
        }
        const msg = await service.email.sendInterviewEmail(info.id);

        if (msg !== null) {
            ctx.status = 500;
            ctx.body = msg;
            return
        }
        ctx.body = info.id;
    }

    public async updateInterview() {
        const { ctx, service } = this;
        const { id, value } = ctx.request.body;

        const info = await service.interview.updateValue(id, value);

        if (info[0] === 0) {
            ctx.status = 500;
            ctx.body = `插入失败没有找到${id}的数据`;
            return
        }
        ctx.body = null;
    }

    public async interviewWebSocket() {
        const { ctx, app, service } = this;
        const id = ctx.request.query.id;
        if (!ctx.websocket) {
            throw new Error('this function can only be use in websocket router');
        }
        console.log('client connected');
        // 根据interview id创建房间
        ctx.websocket.room.join(id);

        const info = await service.interview.findInterviewById(Number(id));

        if (info === null) {
            ctx.status = 500;
            ctx.body = `没有找到${id}的数据`;
            return
        }
        ctx.websocket
            .on('message', async (msg) => {
                // console.log('receive', msg);
                if (!ArrayBuffer.isView(msg)) {
                    return;
                }
                const type = msg[0];
                switch (type) {
                    case encode.encode(WSTypes.heartbeat)[0]:
                        ctx.websocket!.send(this.getBuffer(WSTypes.heartbeat, id));
                        return;
                    case encode.encode(WSTypes.setValue)[0]:
                        info.value = decode.decode(msg.slice(1));
                        if (info.value) {
                            app.ws.sendTo(id, this.getBuffer(WSTypes.getValue, id));
                            // TODO 更新到redis中，防止网络中断数据丢失
                            // Interview.updateValue(Number(id), value);
                        }
                        return;
                    case encode.encode(WSTypes.getValue)[0]:
                        ctx.websocket!.send(this.getBuffer(WSTypes.getValue, info.value));
                        return;
                }
            })
            .on('close', (code, reason) => {
                console.log('websocket closed', code, reason);
                // 存最终的笔试答案
                service.interview.updateValue(Number(id), info.value);
            });
    }

    public getBuffer(type: WSTypes, str: string): Uint8Array {
        const arr = encode.encode(str);
        const newBuffer = new Uint8Array(arr.byteLength + 1);
        newBuffer.set(encode.encode(type), 0);
        newBuffer.set(arr, 1);
        return newBuffer;
    };

}