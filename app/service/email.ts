import { Service } from 'egg';
import { createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { logger } from '@typegoose/typegoose/lib/logSettings';

export default class EmailService extends Service {
    public async sendInterviewEmail(interviewId: number): Promise<String | null> {
        const interview = await this.service.interview.findInterviewById(interviewId);
        if (interview === null) {
            return `没有找到${interviewId}的数据`;
        }
        const from = '"大搜车笔试专用邮箱" <wanyuxiao@souche.com>'
        const subject = "大搜车笔试邀请"
        const text = "欢迎参加大搜车笔试"
        const intervieweeOptions = {
            from,
            to: interview.intervieweeEmail,
            subject,
            text,
            html: `<div>hi，${
                interview.intervieweeName
                }同学，您好，请点击<a href="http://localhost:3000/#/interview-record/detail?id=` +
                interviewId +
                '">链接</a>进入笔试间</div>' // html body
        };

        const interviewerOptions = {
            from,
            to: interview.interviewerEmail,
            subject,
            text,
            html: `<div>hi，${
                interview.interviewerName
                }面试官，您好，请点击<a href="http://localhost:3000/#/interview-record/detail?id=` +
                interviewId +
                '">链接</a>进入笔试间</div>' // html body
        };

        try {
            this.sendEmail(intervieweeOptions);
            this.sendEmail(interviewerOptions);
        } catch (error) {
            return error.message;
        }

        return null;

    }

    public sendEmail(mailOptions: Options) {
        const transporter = createTransport(
            {
                auth: {
                    user: 'wanyuxiao@souche.com',
                    pass: 'Zz1234zZ',
                },
                authMethod: 'PLAIN',
                host: 'smtp.qiye.aliyun.com',
                port: 465,
                secure: true,
            });

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error: any) => {
            if (error) {
                // TODO 钉钉通知
                logger.error('sendMail', error);
            }
        });
    }

}