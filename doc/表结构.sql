use nodedb;
-- Interview
CREATE TABLE IF NOT EXISTS interview_info
(
    id int unsigned not null auto_increment primary key comment '主键',
    interviewee_email varchar(50) null comment '笔试者email',
    interviewee_name  varchar(50) not null comment '笔试者姓名',
    interviewer_email varchar(50) not null comment '笔试官email',
    interviewer_name  varchar(50) not null comment '笔试官姓名',
    interview_value   blob        null comment '笔试内容',
    questions_id      int         null comment '笔试题目id',
    create_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    create_person varchar(20) NOT NULL DEFAULT 'system' COMMENT '创建人',
    update_time datetime NOT NULL DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '修改时间',
    update_person varchar(20) NOT NULL DEFAULT 'system' COMMENT '更新人',
    constraint interviewee_email
        unique (interviewee_email)
)
    ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4 COMMENT 'interview';

blob
