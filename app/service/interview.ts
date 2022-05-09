import {Service} from 'egg';
import Interview from '../model/sql/interview.model';

import {v4 as uuidV4} from 'uuid';
import {EggWsClient} from 'egg-websocket-plugin/app';

enum WSTypes {
    heartbeat = '.',
    setValue = '0',
    getValue = '1',
}

const encode = new TextEncoder();
const decode = new TextDecoder('utf-8');
export default class InterviewService extends Service {
    /**
     * 创建或更新Interview
     * @param interview
     */
    public async createOrUpdateInterview(interview: any): Promise<Interview | null> {
        let info = await Interview.findOne({where: {intervieweeEmail: interview.intervieweeEmail}});
        if (info !== null) {
            info.intervieweeName = interview.intervieweeName;
            info.interviewerEmail = interview.interviewerEmail;
            info.interviewerName = interview.interviewerName;
            info.save();
        } else {
            info = await Interview.create({
                intervieweeEmail: interview.intervieweeEmail,
                intervieweeName: interview.intervieweeName,
                interviewerEmail: interview.interviewerEmail,
                interviewerName: interview.interviewerName,
                value: interview.value
            });
        }
        return info;
    }

    /**
     * 更新最终笔试答案
     * @param id intervieweeId
     * @param value 答案
     */
    public async updateValue(id: number, value: Buffer): Promise<[number, Interview[]]> {
        return Interview.update({
            value: value,
        }, {where: {id}});
    }

    public async findInterviewById(id: number): Promise<Interview | null> {
        return Interview.findOne({where: {id}});
    }

    public async findInterviews(): Promise<Interview[]> {
        return Interview.findAll();
    }

    /**
     * 同步答题内容
     * @param websocket
     * @param id
     */
    public async syncValue(websocket: EggWsClient, id: string): Promise<string | null> {
        const uuid = uuidV4();
        // 根据interview id创建房间
        websocket.room.join(id, ({message}) => {
            const data = JSON.parse(message.toString());
            if (!data || !data.value || data.from === uuid) {
                return;
            }
            // 将消息发送到除自己外的其它房间成员
            websocket.send(encode.encode(data.value));
        });

        // 从数据库里读取
        const info = await this.findInterviewById(Number(id));
        if (info === null) {
            return `没有找到${id}的数据`;
        }
        // 从redis读取最新的笔试信息
        const value = await this.service.redis.get("room" + id);
        websocket
            .on('message', async (msg) => {
                // console.log('receive', msg);
                if (!ArrayBuffer.isView(msg)) {
                    return;
                }
                const type = msg[0];
                switch (type) {
                    case encode.encode(WSTypes.heartbeat)[0]:
                        websocket.send(this.getBuffer(WSTypes.heartbeat, encode.encode(id)));
                        return;
                    case encode.encode(WSTypes.setValue)[0]:
                        // 存入redis最新的笔试信息
                        await this.service.redis.set("room" + id, msg.slice(1));
                        if (msg.slice(1)) {
                            this.app.ws.sendJsonTo(id, {
                                from: uuid,
                                value: decode.decode(this.getBuffer(WSTypes.getValue, msg.slice(1)))
                            });
                        }
                        return;
                    case encode.encode(WSTypes.getValue)[0]:
                        if (!value) {
                            return;
                        }
                        websocket.send(this.getBuffer(WSTypes.getValue, value));
                        return;
                }
            })
            .on('close', (code, reason) => {
                console.log('websocket closed', code, reason);
                // 存最终的笔试答案
                // service.interview.updateValue(Number(id), info.value);
            });
        return null;
    }

    private getBuffer(type: WSTypes, str: Uint8Array | null): Uint8Array {
        if (str === null) {
            return encode.encode(type);
        }
        const newBuffer = new Uint8Array(str.byteLength + 1);
        newBuffer.set(encode.encode(type), 0);
        newBuffer.set(str, 1);
        return newBuffer;
    };
}
