import {BaseModel} from './baseModel';
import {Column, Table} from 'sequelize-typescript';

@Table({tableName: 'question_info'})
export default class Question extends BaseModel<Question> {
    @Column({
        comment: '题库内容',
        field: 'question_value'
    })
    public value: Buffer;

    @Column({
        comment: '答案',
        field: 'answer'
    })
    public answer: Buffer;

    @Column({
        comment: '用例',
        field: 'use_case',
    })
    public useCase: Buffer;
}
