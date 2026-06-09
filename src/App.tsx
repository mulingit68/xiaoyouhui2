/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  Database, 
  Settings, 
  Download, 
  BookOpen, 
  CheckCircle,
  Users,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { UserInfo, AlumniAudit, AlumniEvent, EventRegistration, AlumniEnterprise, JobItem, DonationRecord, UserRole, AuditStatus } from './types';
import MiniProgramSimulator from './components/MiniProgramSimulator';
import WebAdmin from './components/WebAdmin';
import TechDocs from './components/TechDocs';

// 1. 初始化模拟库历史数据
const INITIAL_USERS: UserInfo[] = [
  {
    _id: 'openid_001_visitor',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    nickName: '未绑定的小王',
    phoneNumber: '', // 未绑定手机
    role: UserRole.VISITOR,
    isCertified: false,
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-10T08:00:00Z'
  },
  {
    _id: 'openid_002_certified',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&q=80',
    nickName: '杭州小陈',
    phoneNumber: '13888880001',
    realName: '陈立冬',
    入学年份: 2012,
    毕业年份: 2016,
    学院: '计算机与人工智能学院',
    专业: '软件工程',
    company: '杭州云端物联科技公司',
    position: '资深安全专家',
    role: UserRole.ALUMNI_VERIFIED,
    isCertified: true,
    createdAt: '2026-04-01T10:30:00Z',
    updatedAt: '2026-04-02T15:20:00Z'
  },
  {
    _id: 'openid_003_enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    nickName: '创业者老李',
    phoneNumber: '13999990002',
    realName: '李强峰',
    入学年份: 2008,
    毕业年份: 2012,
    学院: '经济管理与MBA商学院',
    专业: '信息管理与信息系统',
    company: '浙江科创未来智能装备公司',
    position: 'CEO / 联合创始人',
    role: UserRole.ALUMNI_ENTERPRISE,
    isCertified: true,
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-16T11:45:00Z'
  },
  {
    _id: 'openid_04_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80',
    nickName: '梁理事',
    phoneNumber: '13555551234',
    realName: '梁晓乔',
    入学年份: 2000,
    毕业年份: 2004,
    学院: '计算机与人工智能学院',
    专业: '网络安全',
    company: '省校友总会地方秘书处办公室',
    position: '常委理事',
    role: UserRole.ADMIN,
    isCertified: true,
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  },
  {
    _id: 'openid_05_super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80',
    nickName: '杨会长',
    phoneNumber: '13600000000',
    realName: '杨德贤',
    入学年份: 1988,
    毕业年份: 1992,
    学院: '省校友总会',
    专业: '特级理事长',
    company: '地方校友联谊会总会办',
    position: '名誉第一会长 / 终身理事长',
    role: UserRole.SUPER_ADMIN,
    isCertified: true,
    createdAt: '2015-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

const INITIAL_AUDITS: AlumniAudit[] = [
  {
    _id: 'audit_1001_p',
    openid: 'openid_001_visitor', // 未认证游客正递交在排队
    realName: '王建国',
    phoneNumber: '13522223333',
    入学年份: 2016,
    毕业年份: 2020,
    学院: '机械与车辆控制学院',
    专业: '机械设计制造及其自动化',
    studentCardPicUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
    extraInfo: '辅导员名字是张敏老师，2班班长',
    status: AuditStatus.PENDING,
    createdAt: '2026-06-01T14:30:00Z',
    updatedAt: '2026-06-01T14:30:00Z'
  },
  {
    _id: 'audit_1002_a',
    openid: 'openid_002_certified',
    realName: '陈立冬',
    phoneNumber: '13888880001',
    入学年份: 2012,
    毕业年份: 2016,
    学院: '计算机与人工智能学院',
    专业: '软件工程',
    studentCardPicUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
    status: AuditStatus.APPROVED,
    operatorOpenid: 'openid_04_admin',
    auditReply: '学信网登记无差异，核验通过。',
    createdAt: '2026-04-01T10:30:00Z',
    updatedAt: '2026-04-02T15:20:00Z'
  },
  {
    _id: 'audit_1003_a',
    openid: 'openid_003_enterprise',
    realName: '李强峰',
    phoneNumber: '13999990002',
    入学年份: 2008,
    毕业年份: 2012,
    学院: '经济管理与MBA商学院',
    专业: '信息管理与信息系统',
    studentCardPicUrl: '',
    status: AuditStatus.APPROVED,
    operatorOpenid: 'openid_04_admin',
    auditReply: '第二届理事会现场口头背书核验通过。',
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-16T11:45:00Z'
  }
];

const INITIAL_EVENTS: AlumniEvent[] = [
  {
    _id: 'evt_201_meet',
    title: '【杭温同袍】2026年夏季首场线下资源合作论坛暨烧烤酒会沙龙',
    coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    description: '诚邀江浙沪同城科技界、投行界及制造业商友骨干理事报名。届时特设行业桌及自由对焦分享，欢迎对接行业硬科技资源。',
    startTime: '2026-07-16 14:00',
    endTime: '2026-07-16 21:00',
    location: '杭州滨江天目里•校友茶家别座',
    limitCount: 80,
    joinedCount: 32,
    needAudit: true, // 审核加塞
    fee: 100, // 众筹差旅茶点
    status: 'PUBLISHED',
    publisher: '大湾区秘书处工作办公室',
    createdAt: '2026-05-15T12:00:00Z',
    updatedAt: '2026-05-15T12:00:00Z'
  },
  {
    _id: 'evt_202_visit',
    title: '【企业行】走进知名校友创办企业浙江高精智能装备集团研学行',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
    description: '由杨会长和名誉李强峰学长联合带队。考察重工厂线、听取战略部汇报，并向新入行刚结业的学弟师妹提供当场面试绿色内推直聘指标！',
    startTime: '2026-08-20 09:30',
    endTime: '2026-08-20 17:00',
    location: '绍兴高新技术产业开发区智能化路8号',
    limitCount: 30,
    joinedCount: 14,
    needAudit: false, // 抢麦直接加入
    fee: 0,
    status: 'PUBLISHED',
    publisher: '总会商圈联谊处',
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z'
  }
];

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    _id: 'DON_20260510101',
    openid: 'openid_002_certified',
    donorName: '陈立冬',
    入学年份: 2012,
    type: 'MEMBERSHIP_FEE',
    amount: 200,
    projectTitle: '2026年年度会费',
    payStatus: 'SUCCESS',
    payTime: '2026-05-10T10:05:00Z',
    certificateNo: 'HY20260510001',
    blessingMessage: '祝地方校友分会越办越好！同泽不散！',
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:05:00Z'
  },
  {
    _id: 'DON_20260518204',
    openid: 'openid_003_enterprise',
    donorName: '李强峰',
    入学年份: 2008,
    type: 'DONATION',
    amount: 10000,
    projectTitle: '母校励志奖学金专项发展基金',
    payStatus: 'SUCCESS',
    payTime: '2026-05-18T16:00:00Z',
    certificateNo: 'JX20260518002',
    blessingMessage: '捐助商学院家庭困难考硕及绩优学弟们，加油起跑！',
    createdAt: '2026-05-18T15:50:00Z',
    updatedAt: '2026-05-18T16:00:00Z'
  }
];

const INITIAL_JOBS: JobItem[] = [
  {
    _id: 'job_301',
    enterpriseName: '浙江科创未来智能装备公司（校友创办）',
    title: '资深嵌入式 C++ 开发骨干专家',
    salary: '25k-35k·15薪',
    location: '杭州滨江区',
    experience: '3-5年',
    education: '本科',
    description: '负责军工或特高压物联网机械臂控主算开发。李强峰学长名下核心组建内推，绝对不卡简历和年龄上限。',
    contactEmail: 'career@innovations-future.com',
    publisherOpenid: 'openid_003_enterprise',
    status: 'OPEN',
    createdAt: '2026-05-22T08:00:00Z',
    updatedAt: '2026-05-22T08:00:00Z'
  },
  {
    _id: 'job_302',
    enterpriseName: '杭州云端物联科技公司（校友合伙）',
    title: 'React 前端工程专家（高层骨干）',
    salary: '18k-25k',
    location: '杭州西湖区',
    experience: '1-3年',
    education: '本科',
    description: '参与万物互联工业可视化组态大屏研发，配合陈立冬学长组建精尖前端战斗单元。',
    contactEmail: 'front_join@cloud-iot-hz.com',
    publisherOpenid: 'openid_002_certified',
    status: 'OPEN',
    createdAt: '2026-05-28T14:30:00Z',
    updatedAt: '2026-05-28T14:30:00Z'
  }
];

export default function App() {
  // 当前顶部主 Tab: 'miniprogram' | 'webadmin' | 'techdocs'
  const [activeTab, setActiveTab] = useState<'miniprogram' | 'webadmin' | 'techdocs'>('miniprogram');
  
  // 模拟微信用户快捷切换，以便检验多端鉴权
  const [sessionOpenId, setSessionOpenId] = useState<string>('openid_001_visitor');

  // 全局响应模拟状态引擎
  const [usersList, setUsersList] = useState<UserInfo[]>(INITIAL_USERS);
  const [auditList, setAuditList] = useState<AlumniAudit[]>(INITIAL_AUDITS);
  const [eventsList, setEventsList] = useState<AlumniEvent[]>(INITIAL_EVENTS);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [enterprisesList, setEnterprisesList] = useState<AlumniEnterprise[]>([]);
  const [jobsList, setJobsList] = useState<JobItem[]>(INITIAL_JOBS);
  const [donationsList, setDonationsList] = useState<DonationRecord[]>(INITIAL_DONATIONS);

  // 获取当前正在操作的小程序微信拥有者的 Profile
  const currentUser = usersList.find(u => u._id === sessionOpenId) || usersList[0];

  // 微信授权状态/基本资料变动同步
  const handleUpdateCurrentUser = (updatedUser: UserInfo) => {
    setUsersList(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
  };

  // 小程序内提交校友实名资质认证
  const handleSubmitAudit = (newAudit: AlumniAudit) => {
    setAuditList(prev => [...prev, newAudit]);
  };

  // 核心管理层审批决策（修改申请表并瞬间将用户升华提权）
  const handleUpdateAuditStatus = (auditId: string, status: AuditStatus, reply?: string) => {
    setAuditList(prev => prev.map(a => {
      if (a._id === auditId) {
        const updatedAudit = {
          ...a,
          status,
          auditReply: reply || (status === AuditStatus.APPROVED ? '经教务实名系统比对无误，核发荣誉校友徽章！' : '不吻合'),
          updatedAt: new Date().toISOString()
        };

        // 如果是批准通过, 将该名用户的 role 升级为 ALUMNI_VERIFIED
        if (status === AuditStatus.APPROVED) {
          setUsersList(users => users.map(u => {
            if (u._id === a.openid) {
              return {
                ...u,
                role: UserRole.ALUMNI_VERIFIED,
                isCertified: true,
                realName: a.realName,
                入学年份: a.入学年份,
                学院: a.学院,
                专业: a.专业,
                updatedAt: new Date().toISOString()
              };
            }
            return u;
          }));
        } else if (status === AuditStatus.REJECTED) {
          // 如果是拒绝驳回
          setUsersList(users => users.map(u => {
            if (u._id === a.openid) {
              return {
                ...u,
                role: UserRole.VISITOR,
                isCertified: false,
                updatedAt: new Date().toISOString()
              };
            }
            return u;
          }));
        }

        return updatedAudit;
      }
      return a;
    }));
  };

  // 会员极速抢报加入活动
  const handleJoinEvent = (reg: EventRegistration) => {
    setEventRegistrations(prev => [...prev, reg]);
    // 增加对应活动报人数值计数
    setEventsList(evt => evt.map(e => {
      if (e._id === reg.eventId) {
        return {
          ...e,
          joinedCount: e.joinedCount + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    }));
  };

  const handleUpdateRegistrationStatus = (regId: string, status: AuditStatus) => {
    setEventRegistrations(prev => prev.map(r => r._id === regId ? { ...r, status, updatedAt: new Date().toISOString() } : r));
  };

  const handleCreateEnterprise = (enterprise: AlumniEnterprise) => {
    setEnterprisesList(prev => [...prev, enterprise]);
  };

  const handleCreateJob = (job: JobItem) => {
    setJobsList(prev => [...prev, job]);
  };

  // 校友赞助付款，会费入账
  const handleDonate = (donation: DonationRecord) => {
    setDonationsList(prev => [...prev, donation]);
  };

  // 超级管理员手拨任免角色
  const handlePromoteUser = (openid: string, role: UserRole) => {
    setUsersList(prev => prev.map(u => {
      if (u._id === openid) {
        return {
          ...u,
          role,
          isCertified: role !== UserRole.VISITOR,
          updatedAt: new Date().toISOString()
        };
      }
      return u;
    }));
  };

  // 拓展接口：自研活动发布直接同步
  const handleCreateEvent = (eventItem: AlumniEvent) => {
    setEventsList(prev => [...prev, eventItem]);
  };

  // 对外模拟小程序包导出
  const mockExportZip = () => {
    alert('🎉 已生成生产可编译的 地方校友会微信小程序原生 TypeScript 客户端包及三合一安全云函数部署包(zip)！您可以在「技术规划与部署全书」栏目直接提取和拷贝各文件的最简完整核心代码。');
  };

  return (
    <div id="alumni-platform-application" className="min-h-screen bg-slate-50 flex flex-col antialiased font-sans">
      
      {/* 顶部中央工作栏 */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xs select-none">
        
        {/* 标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-qzhong-navy text-white rounded-lg flex items-center justify-center font-display text-lg font-bold shadow-sm border border-qzhong-gold">
            侨
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight font-sans text-qzhong-navy">
              佛山市三水区华侨中学校友会信息网络平台开发工作站
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-sans">
              <Zap className="w-3.5 h-3.5 text-qzhong-gold shrink-0 animate-pulse" />
              基于原生微信小程序 (TypeScript + 微信开发) 与 React 双模管理端，第一版核心闭环已就绪
            </p>
          </div>
        </div>

        {/* 核心出口按钮 */}
        <div className="flex items-center gap-2">
          <button 
            onClick={mockExportZip}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs px-3.5 py-2 rounded-lg font-medium shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            导出小程序 + 云数据库集合包
          </button>
        </div>
      </header>

      {/* 快速角色调试面板 (全局状态调试带 - 极简灰设计) */}
      <div className="bg-slate-900 text-slate-300 py-3 px-6 flex flex-col lg:flex-row justify-between items-center gap-2.5 font-sans border-b border-slate-800 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="bg-qzhong-navy border border-qzhong-gold text-white rounded px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
            快速角色调试 (Fast-Tuning Belt)
          </span>
          <span className="text-[11px] text-slate-400 leading-none">
            您可在下方<b>动态切换模拟微信号绑定身份</b>，观察终端鉴权控制及过审、提权联动效果：
          </span>
        </div>

        {/* 极速任职控制单元 */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {usersList.map(user => (
            <button
              key={user._id}
              onClick={() => setSessionOpenId(user._id)}
              className={`text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                sessionOpenId === user._id
                  ? 'bg-qzhong-navy text-white shadow-sm border-qzhong-gold font-semibold'
                  : 'bg-slate-800 text-slate-400 border-slate-700/50 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              👤 {user.realName || user.nickName} ({
                user.role === UserRole.VISITOR ? '访客' : (
                  user.role === UserRole.ADMIN ? '理事' : (
                    user.role === UserRole.SUPER_ADMIN ? '超级会长' : '正式会友'
                  )
                )
              })
            </button>
          ))}
        </div>
      </div>

      {/* 工作区主 Tab 栏 (三大核心业务大屏) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 shrink-0 flex gap-2 justify-start shadow-xs select-none">
        <button
          onClick={() => setActiveTab('miniprogram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'miniprogram'
              ? 'bg-qzhong-navy text-white font-medium shadow-xs border border-qzhong-gold/30'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          📱 微信小程序客户端模拟沙箱 (WeChat Client Simulator)
        </button>
        <button
          onClick={() => setActiveTab('webadmin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'webadmin'
              ? 'bg-qzhong-navy text-white font-medium shadow-xs border border-qzhong-gold/30'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4" />
          💻 WEB 理事会长管理后台控制台 (Admin Web End)
        </button>
        <button
          onClick={() => setActiveTab('techdocs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'techdocs'
              ? 'bg-qzhong-navy text-white font-medium shadow-xs border border-qzhong-gold/30'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          🌐 架构设计、数据库集合与部署指导全书 (Eng Docs & Design)
        </button>
      </div>

      {/* 主视图内容区域 */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'miniprogram' && (
          <div className="max-w-[1000px] mx-auto animate-fade-in">
            <MiniProgramSimulator
              currentUser={currentUser}
              usersList={usersList}
              auditList={auditList}
              eventsList={eventsList}
              eventRegistrations={eventRegistrations}
              enterprisesList={enterprisesList}
              jobsList={jobsList}
              donationsList={donationsList}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onSubmitAudit={handleSubmitAudit}
              onUpdateAuditStatus={handleUpdateAuditStatus}
              onJoinEvent={handleJoinEvent}
              onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
              onCreateEnterprise={handleCreateEnterprise}
              onCreateJob={handleCreateJob}
              onDonate={handleDonate}
              onPromoteUser={handlePromoteUser}
            />
          </div>
        )}

        {activeTab === 'webadmin' && (
          <div className="max-w-[1240px] mx-auto animate-fade-in">
            <WebAdmin
              currentUser={currentUser}
              usersList={usersList}
              auditList={auditList}
              eventsList={eventsList}
              eventRegistrations={eventRegistrations}
              enterprisesList={enterprisesList}
              jobsList={jobsList}
              donationsList={donationsList}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onSubmitAudit={handleSubmitAudit}
              onUpdateAuditStatus={handleUpdateAuditStatus}
              onJoinEvent={handleJoinEvent}
              onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
              onCreateEnterprise={handleCreateEnterprise}
              onCreateJob={handleCreateJob}
              onDonate={handleDonate}
              onPromoteUser={handlePromoteUser}
              onCreateEvent={handleCreateEvent}
            />
          </div>
        )}

        {activeTab === 'techdocs' && (
          <div className="max-w-[1240px] mx-auto animate-fade-in">
            <TechDocs />
          </div>
        )}
      </main>

      {/* 底部版权备案栏 */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-4 px-6 text-center text-[10px] shrink-0 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>地方公会备案代码: LAT-P2026-X017 • 微信开放平台双资质核定认证平台</span>
          <span>© Copyright 2026 Google AI Studio. Designed for WeChat Cloud Miniprogram.</span>
        </div>
      </footer>

    </div>
  );
}
