import { Service } from 'egg';
import Interview from '../model/sql/interview.model';

export default class InterviewService extends Service {
    /**
     * 创建或更新Interview
     * @param Interview interview
     */
    public async createOrUpdateInterview(interview: any): Promise<Interview | null> {
        let info = await Interview.findOne({ where: { intervieweeEmail: interview.intervieweeEmail } })
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

    public async updateValue(id: number, value: Buffer): Promise<[number, Interview[]]> {
        return Interview.update({
            value: value,
        }, { where: { id } });
    }

    public async findInterviewById(id: number): Promise<Interview | null> {
        return Interview.findOne({ where: { id } })
    }
}
