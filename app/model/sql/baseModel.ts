import { Column, Model, CreatedAt, UpdatedAt } from 'sequelize-typescript';

/**
 * BaseModel
 */
export class BaseModel<T> extends Model<T> {
    /**
     * 自增主键
     */
    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    public id: number;

    /**
     * 创建时间
     */
    @CreatedAt
    public create_time: Date;

    /**
     * 修改时间
     */
    @UpdatedAt
    public update_time: Date;

    /**
     * 创建人
     */
    @Column
    public create_person: string;

    /**
     * 修改人
     */
    @Column
    public update_person: string;
}
