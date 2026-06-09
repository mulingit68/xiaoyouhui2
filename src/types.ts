/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 用户角色枚举
export enum UserRole {
  VISITOR = 'VISITOR',               // 普通访客
  ALUMNI_VERIFIED = 'ALUMNI_VERIFIED', // 认证校友
  ALUMNI_ENTERPRISE = 'ALUMNI_ENTERPRISE', // 企业校友
  SCHOOL_OFFICIAL = 'SCHOOL_OFFICIAL', // 学校/学院官方人员
  ADMIN = 'ADMIN',                   // 管理员
  SUPER_ADMIN = 'SUPER_ADMIN'        // 超级管理员
}

// 审核状态
export enum AuditStatus {
  PENDING = 'PENDING',               // 待审核
  APPROVED = 'APPROVED',             // 审核通过
  REJECTED = 'REJECTED'              // 已拒绝
}

// 1. 用户信息集合 (users)
export interface UserInfo {
  _id: string;                       // 微信OpenID
  unionid?: string;                  // 微信UnionID
  avatarUrl: string;                 // 头像
  nickName: string;                  // 昵称
  phoneNumber: string;               // 绑定手机号
  realName?: string;                 // 真实姓名
  入学年份?: number;                 // 入学年份
  毕业年份?: number;                 // 毕业年份
  学院?: string;                     // 学院
  专业?: string;                     // 专业
  学号?: string;                     // 学号 (可选)
  currentCity?: string;              // 所在城市
  company?: string;                  // 工作单位
  position?: string;                 // 职务
  role: UserRole;                    // 角色级别
  isCertified: boolean;              // 是否已认证
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
}

// 2. 校友认证申请集合 (alumni_audits)
export interface AlumniAudit {
  _id: string;                       // 申请ID
  openid: string;                    // 申请人openid
  realName: string;                  // 真实姓名
  phoneNumber: string;               // 联系手机号
  入学年份: number;                  // 入学年份
  毕业年份: number;                  // 毕业年份
  学院: string;                      // 学院名称
  专业: string;                      // 专业名称
  studentCardPicUrl?: string;        // 学信网截图/毕业证照片链接
  extraInfo?: string;                // 备注备注说明
  status: AuditStatus;               // 审批状态
  operatorOpenid?: string;           // 审批管理员openid
  auditReply?: string;               // 审核意见 / 驳回理由
  createdAt: string;
  updatedAt: string;
}

// 3. 首页轮播图 (banners)
export interface Banner {
  _id: string;
  imageUrl: string;                  // 图片链接
  title: string;                     // 标题
  jumpType: 'none' | 'news' | 'event' | 'webview';
  jumpId?: string;                   // 关联的文章/活动ID
  sortOrder: number;                 // 排序
  isActive: boolean;                 // 是否开启
}

// 4. 新闻资讯集合 (news)
export interface NewsItem {
  _id: string;
  title: string;                     // 标题
  summary: string;                   // 摘要
  content: string;                   // Markdown/富文本内容
  coverUrl: string;                  // 封面图
  author: string;                    // 作者/发布机构
  viewCount: number;                 // 浏览量
  isTop: boolean;                    // 是否置顶
  createdAt: string;
  updatedAt: string;
}

// 5. 校友活动集合 (events)
export interface AlumniEvent {
  _id: string;
  title: string;                     // 活动名称
  coverUrl: string;                  // 活动主图
  description: string;               // 活动详情描述
  startTime: string;                 // 开始时间
  endTime: string;                   // 结束时间
  location: string;                  // 活动地址
  limitCount: number;                // 限制人数，0表示不限制
  joinedCount: number;               // 已报名人数
  needAudit: boolean;                // 报名是否需要管理员审核
  fee: number;                       // 报名费用，0表示免费
  status: 'PUBLISHED' | 'ONGOING' | 'ENDED' | 'CANCELLED'; // 活动状态
  publisher: string;                 // 发布者
  createdAt: string;
  updatedAt: string;
}

// 6. 活动报名登记集合 (event_registrations)
export interface EventRegistration {
  _id: string;
  eventId: string;                   // 活动ID
  openid: string;                    // 报名人OpenId
  realName: string;                  // 姓名
  phoneNumber: string;               // 手机号
  company?: string;                  // 所在单位
  remark?: string;                   // 备注
  status: AuditStatus;               // 报名审批状态
  createdAt: string;
  updatedAt: string;
}

// 7. 校友企业集合 (enterprises)
export interface AlumniEnterprise {
  _id: string;
  openid: string;                    // 创办人/负责人openid
  name: string;                      // 企业名称
  logoUrl: string;                   // 企业Logo
  industry: string;                  // 所属行业
  scale: string;                     // 企业规模
  website?: string;                  // 官方网站
  contactName: string;               // 联系人姓名
  contactPhone: string;              // 联系人电话
  address: string;                   // 企业地址
  introduction: string;              // 企业简介与主营业务
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;               // 管理员是否验审通过
}

// 8. 招聘信息集合 (jobs)
export interface JobItem {
  _id: string;
  enterpriseId?: string;             // 关联的校友企业ID (如果有)
  enterpriseName: string;            // 企业名称 (手动填写或关联获取)
  title: string;                     // 职位名称
  salary: string;                    // 薪资范围，e.g. "10k-15k"
  location: string;                  // 工作地点
  experience: string;                // 经验要求，e.g. "1-3年"
  education: string;                 // 学历要求，e.g. "本科"
  description: string;               // 岗位职责与任职要求
  contactEmail: string;              // 简历接收邮箱
  contactPhone?: string;             // 咨询方式
  publisherOpenid: string;           // 发布者OpenID
  status: 'OPEN' | 'CLOSED';         // 招聘状态
  createdAt: string;
  updatedAt: string;
}

// 9. 会费/基金捐赠记录集合 (donations)
export interface DonationRecord {
  _id: string;
  openid: string;                    // 捐赠人openid
  donorName: string;                 // 捐赠人姓名 (真实填写)
  入学年份?: number;                 // 入学年份
  type: 'MEMBERSHIP_FEE' | 'DONATION'; // MEMBERSHIP_FEE=会费, DONATION=特别捐赠
  amount: number;                    // 捐赠金额 (单位: 元)
  projectTitle: string;              // 捐赠项目/群组 (e.g. "2026年年度会费", "母校励志奖学金")
  payStatus: 'SUCCESS' | 'WAIT_PAY'; // 支付状态
  payTime?: string;                  // 支付时间
  certificateNo?: string;            // 捐赠证书编号 (成功后自动生成)
  blessingMessage?: string;          // 寄语/祝福
  createdAt: string;
  updatedAt: string;
}

// 10. 系统日志集合 (operation_logs)
export interface OperationLog {
  _id: string;
  operatorOpenid: string;
  operatorName: string;
  role: UserRole;
  action: string;                    // 操作细节描述
  ip?: string;
  createdAt: string;
}
