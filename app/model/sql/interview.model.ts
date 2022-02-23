import { BaseModel } from './baseModel';
import { Column, Table } from 'sequelize-typescript';

@Table({ tableName: 'interview_info' })
export default class Interview extends BaseModel<Interview> {
    @Column({
        unique: true,
        comment: '笔试者email',
        field: 'interviewee_email'
    })
    public intervieweeEmail: string;

    @Column({
        comment: '笔试者姓名',
        allowNull: false,
        field: 'interviewee_name'
    })
    public intervieweeName: string;

    @Column({
        comment: '笔试官email',
        allowNull: false,
        field: 'interviewer_email'
    })
    public interviewerEmail: string;

    @Column({
        comment: '笔试官姓名',
        allowNull: false,
        field: 'interviewer_name'
    })
    public interviewerName: string;

    @Column({
        comment: '笔试内容',
        field: 'interview_value'
    })
    public value: Buffer;

    @Column({
        comment: '笔试题目id',
        field: 'questions_id'
    })
    public questionsId: number;
}
