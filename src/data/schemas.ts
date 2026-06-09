/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CollectionSchema {
  collectionName: string;
  description: string;
  permission: string; // "所有者可读写、其他人只读", "仅管理员可读写" 等
  indexes: string[];
  fields: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export const CLOUD_DB_SCHEMAS: CollectionSchema[] = [
  {
    collectionName: "users",
    description: "用户账户档案表，记录微信用户的基本信息、绑定手机号、角色、及校友认证的基本档案信息。",
    permission: "所有者可读写，其他人只读（管理员拥有全部读写权限）",
    indexes: ["_id (openid) - 唯一索引", "phoneNumber - 唯一索引", "role - 非唯一索引", "realName - 全文检索辅助"],
    fields: [
      { name: "_id", type: "String", description: "用户的微信OpenID", required: true },
      { name: "unionid", type: "String", description: "微信开放平台唯一标识", required: false },
      { name: "avatarUrl", type: "String", description: "用户微信头像URL", required: true },
      { name: "nickName", type: "String", description: "用户微信昵称", required: true },
      { name: "phoneNumber", type: "String", description: "绑定的中国大陆手机号", required: true },
      { name: "realName", type: "String", description: "校友真实姓名", required: false },
      { name: "入学年份", type: "Number", description: "入学四位年份，例如 2012", required: false },
      { name: "毕业年份", type: "Number", description: "毕业四位年份，例如 2016", required: false },
      { name: "学院", type: "String", description: "就读学院名称，如 '计算机学院'", required: false },
      { name: "专业", type: "String", description: "所学专业，如 '软件工程'", required: false },
      { name: "学号", type: "String", description: "在校学号，辅助认证用", required: false },
      { name: "currentCity", type: "String", description: "当前工作或居住城市", required: false },
      { name: "company", type: "String", description: "工作单位/企业名称", required: false },
      { name: "position", type: "String", description: "目前职位", required: false },
      { name: "role", type: "String", description: "角色(VISITOR/ALUMNI_VERIFIED/ADMIN等)", required: true },
      { name: "isCertified", type: "Boolean", description: "是否通过官方/管理员校友认证", required: true },
      { name: "createdAt", type: "Date/String", description: "账户注册创建时间戳", required: true },
      { name: "updatedAt", type: "Date/String", description: "最近一次档案更新时间戳", required: true }
    ]
  },
  {
    collectionName: "alumni_audits",
    description: "校友认证申请记录，包括用户提交的姓名、届别、学历证明附件以及管理员的审核流程与拒绝反馈。",
    permission: "仅创建者可读写，管理员可读写",
    indexes: ["_id - 自动生成", "openid - 用户关联索引", "status - 非唯一索引"],
    fields: [
      { name: "_id", type: "String", description: "系统默认生成的申请文档ID", required: true },
      { name: "openid", type: "String", description: "申请人的微信OpenID", required: true },
      { name: "realName", type: "String", description: "提交的真实姓名", required: true },
      { name: "phoneNumber", type: "String", description: "手机号，方便电话核验", required: true },
      { name: "入学年份", type: "Number", description: "入学年份", required: true },
      { name: "毕业年份", type: "Number", description: "毕业年份", required: true },
      { name: "学院", type: "String", description: "毕业学院", required: true },
      { name: "专业", type: "String", description: "毕业专业", required: true },
      { name: "studentCardPicUrl", type: "String", description: "学信网截图/学位证/毕业证云存储FileID", required: false },
      { name: "extraInfo", type: "String", description: "补充说明(如同班同学、辅导员名字等)", required: false },
      { name: "status", type: "String", description: "待审核 PENDING / 通过 APPROVED / 驳回 REJECTED", required: true },
      { name: "operatorOpenid", type: "String", description: "经办管理员的OpenID", required: false },
      { name: "auditReply", type: "String", description: "驳回理由/审批意见", required: false },
      { name: "createdAt", type: "Date/String", description: "申请日期", required: true },
      { name: "updatedAt", type: "Date/String", description: "最新处理日期", required: true }
    ]
  },
  {
    collectionName: "events",
    description: "校友会举办的活动列表，包含开始结束时间、地址、上限人数以及是否需要认证校友才能加入。",
    permission: "所有人只读，管理员可读写",
    indexes: ["_id", "status - 状态过滤", "startTime - 活动时间倒序"],
    fields: [
      { name: "_id", type: "String", description: "活动UUID", required: true },
      { name: "title", type: "String", description: "活动主题名称", required: true },
      { name: "coverUrl", type: "String", description: "活动宣传图云存储文件FileID", required: true },
      { name: "description", type: "String", description: "活动详情Markdown富文本说明", required: true },
      { name: "startTime", type: "String", description: "活动开始时间 yyyy-MM-dd HH:mm", required: true },
      { name: "endTime", type: "String", description: "活动结束时间 yyyy-MM-dd HH:mm", required: true },
      { name: "location", type: "String", description: "活动开展地点或线上链接", required: true },
      { name: "limitCount", type: "Number", description: "人数上限，0表示不限制", required: true },
      { name: "joinedCount", type: "Number", description: "当前成功报名人数", required: true },
      { name: "needAudit", type: "Boolean", description: "报名审核制(通过才算报名成功)", required: true },
      { name: "fee", type: "Number", description: "活动报名会费/赞助费(单位：元)", required: true },
      { name: "status", type: "String", description: "活动状态: PUBLISHED/ONGOING/ENDED/CANCELLED", required: true },
      { name: "publisher", type: "String", description: "活动发布组织或管理员姓名", required: true },
      { name: "createdAt", type: "Date/String", description: "发布时间", required: true },
      { name: "updatedAt", type: "Date/String", description: "修改时间", required: true }
    ]
  },
  {
    collectionName: "event_registrations",
    description: "活动报名登记，记录特定活动的用户参与数据和审核结果状态。",
    permission: "创建者可读写，所有人只读（方便参会人自我查验）",
    indexes: ["_id", "eventId", "openid", "eventId_openid_unique - 唯一复合索引"],
    fields: [
      { name: "_id", type: "String", description: "报名详情ID", required: true },
      { name: "eventId", type: "String", description: "关联的活动主键ID", required: true },
      { name: "openid", type: "String", description: "报名人员微信OpenID", required: true },
      { name: "realName", type: "String", description: "报名填写的真实姓名", required: true },
      { name: "phoneNumber", type: "String", description: "联系手机号", required: true },
      { name: "company", type: "String", description: "就职企业", required: false },
      { name: "remark", type: "String", description: "留言备注", required: false },
      { name: "status", type: "String", description: "PENDING 待审 / APPROVED 已报名 / REJECTED 驳回", required: true },
      { name: "createdAt", type: "Date/String", description: "报名时间", required: true },
      { name: "updatedAt", type: "Date/String", description: "更新时间", required: true }
    ]
  },
  {
    collectionName: "enterprises",
    description: "校友企业展示集合，面向校友黄页，用于促进校友企业间的互助与行业资源对接。",
    permission: "所有人只读，创建者与管理员可读写",
    indexes: ["_id", "industry - 行业索引", "isVerified - 审核状态"],
    fields: [
      { name: "_id", type: "String", description: "企业唯一文档ID", required: true },
      { name: "openid", type: "String", description: "企业负责人微信OpenID", required: true },
      { name: "name", type: "String", description: "校友企业工商注册/通用名", required: true },
      { name: "logoUrl", type: "String", description: "企业商标Logo FileID", required: true },
      { name: "industry", type: "String", description: "所属行业(如 TMT/实体制造/新消费/生物医药)", required: true },
      { name: "scale", type: "String", description: "企业规模(如 20人以下/20-99人/100-499人/500人以上)", required: true },
      { name: "website", type: "String", description: "官网或微信公众号链接", required: false },
      { name: "contactName", type: "String", description: "对外联络人姓名", required: true },
      { name: "contactPhone", type: "String", description: "联络方式", required: true },
      { name: "address", type: "String", description: "企业详细驻地", required: true },
      { name: "introduction", type: "String", description: "主营业务与企业深度介绍", required: true },
      { name: "isVerified", type: "Boolean", description: "是否通过管理员资质核实(避免涉虚涉假信息)", required: true },
      { name: "createdAt", type: "Date/String", description: "建档日期", required: true },
      { name: "updatedAt", type: "Date/String", description: "更新日期", required: true }
    ]
  },
  {
    collectionName: "jobs",
    description: "校友企业内推及招聘岗位，专门为刚毕业或谋求转岗的校友提供专属、绿色内推渠道。",
    permission: "所有人只读，创建者与管理员可读写",
    indexes: ["_id", "enterpriseId - 关联企业", "status - 在招状态"],
    fields: [
      { name: "_id", type: "String", description: "岗位文档唯一ID", required: true },
      { name: "enterpriseId", type: "String", description: "所属校友企业ID，可为空", required: false },
      { name: "enterpriseName", type: "String", description: "企业全称", required: true },
      { name: "title", type: "String", description: "招聘岗位名(如 前端工程专家)", required: true },
      { name: "salary", type: "String", description: "薪资范畴(如 15K-25K·14薪)", required: true },
      { name: "location", type: "String", description: "工作城市及办公区", required: true },
      { name: "experience", type: "String", description: "工作经验年限要求", required: true },
      { name: "education", type: "String", description: "最低学历要求(专科/本科/硕士/博士)", required: true },
      { name: "description", type: "String", description: "岗位职责及任职门槛 details", required: true },
      { name: "contactEmail", type: "String", description: "接收简历的邮箱", required: true },
      { name: "contactPhone", type: "String", description: "招聘负责人联络电话/微信号", required: false },
      { name: "publisherOpenid", type: "String", description: "发布者的微信OpenID", required: true },
      { name: "status", type: "String", description: "在招状态 OPEN / 暂停招聘 CLOSED", required: true },
      { name: "createdAt", type: "Date/String", description: "信息上线时间", required: true },
      { name: "updatedAt", type: "Date/String", description: "最后修改时间", required: true }
    ]
  },
  {
    collectionName: "donations",
    description: "记录校友交纳的年费/会费，或者特定学校公益项目、基建基金、奖学金的现金爱心捐赠台账。",
    permission: "所有人只读（名录榜单），特定所有者可看细节",
    indexes: ["_id", "openid", "type - 捐赠分类", "payStatus - 支付状态"],
    fields: [
      { name: "_id", type: "String", description: "捐赠流水订单ID", required: true },
      { name: "openid", type: "String", description: "捐赠校友的主键OpenID", required: true },
      { name: "donorName", type: "String", description: "校友姓名，提供显署或匿名选择", required: true },
      { name: "入学年份", type: "Number", description: "所属届别，用于在爱心榜单展示", required: false },
      { name: "type", type: "String", description: "会费 MEMBERSHIP_FEE / 慈善捐赠 DONATION", required: true },
      { name: "amount", type: "Number", description: "具体支付金额（人民币元，支持两位小数）", required: true },
      { name: "projectTitle", type: "String", description: "捐赠目标项目，如'校友之家修缮计划'", required: true },
      { name: "payStatus", type: "String", description: "待支付 WAIT_PAY / 支付成功 SUCCESS", required: true },
      { name: "payTime", type: "String", description: "微信支付到账精确时间", required: false },
      { name: "certificateNo", type: "String", description: "唯一电子感谢信/证书序列号，如'XY20260401032'", required: false },
      { name: "blessingMessage", type: "String", description: "爱心寄语与对母校、校友会的期许", required: false },
      { name: "createdAt", type: "Date/String", description: "创建表单的时间", required: true },
      { name: "updatedAt", type: "Date/String", description: "更新记录的时间", required: true }
    ]
  }
];
